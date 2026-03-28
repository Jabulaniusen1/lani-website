import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "@/Context";
import { useNavigate } from "react-router-dom";
import { apiRequest, clearTokens, getAccessToken, getRefreshToken, setTokens } from "@/Backend/api";

const DEFAULT_RATES: Models.Document = {
  $id: "rates",
  $createdAt: new Date().toISOString(),
  $updatedAt: new Date().toISOString(),
  rateForUyo: 300,
  rateForPh: 350,
};

const PROFILE_EXTRAS_KEY = "lani_profile_extras";

type ApiUser = {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  merchant?: {
    id?: string;
    businessName?: string;
    merchantType?: string;
    isApproved?: boolean;
  } | null;
  rider?: {
    id?: string;
    isApproved?: boolean;
    isOnboarded?: boolean;
  } | null;
};

const readExtras = () => {
  if (typeof window === "undefined") return {} as Record<string, Record<string, unknown>>;

  try {
    const value = window.localStorage.getItem(PROFILE_EXTRAS_KEY);
    return value ? (JSON.parse(value) as Record<string, Record<string, unknown>>) : {};
  } catch {
    return {} as Record<string, Record<string, unknown>>;
  }
};

const writeExtras = (extras: Record<string, Record<string, unknown>>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_EXTRAS_KEY, JSON.stringify(extras));
};

const splitName = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || name,
    lastName: parts.slice(1).join(" ") || "User",
  };
};

const mapRole = (role?: string) => {
  if (!role) return "customer";
  const normalized = role.toUpperCase();

  if (normalized === "MERCHANT") return "restaurant";
  if (normalized === "RIDER") return "rider";
  if (normalized === "ADMIN") return "admin";
  return "customer";
};

const toUserDocument = (
  user: ApiUser,
  extras: Record<string, unknown> = {}
): Models.Document => {
  const firstName = user.firstName || "";
  const lastName = user.lastName || "";
  const fullName = user.name || `${firstName} ${lastName}`.trim() || "User";
  const mappedRole = mapRole(user.role);
  const location = (extras.location as string) || "";

  return {
    $id: user.id,
    $createdAt: user.createdAt || new Date().toISOString(),
    $updatedAt: user.updatedAt || new Date().toISOString(),
    name: fullName,
    email: user.email || "",
    phone: user.phone || "",
    role: mappedRole,
    subrole: mappedRole === "restaurant" ? "business" : "",
    isVerified: Boolean(user.isVerified || user.merchant?.isApproved || user.rider?.isApproved),
    riderIsOnboarded: Boolean(user.rider?.isOnboarded),
    isAdmin: mapRole(user.role) === "admin",
    isActive: user.isActive ?? true,
    location,
    city: location,
    address: (extras.address as string) || "",
    companyName: (extras.companyName as string) || user.merchant?.businessName || "",
    companyAddress: (extras.companyAddress as string) || "",
    companyEmail: (extras.companyEmail as string) || user.email || "",
    businessName: (extras.businessName as string) || user.merchant?.businessName || "",
    businessRegNo: (extras.businessRegNo as string) || "",
    wallet: Number((extras.wallet as number) || 0),
    merchantId: user.merchant?.id,
    riderId: user.rider?.id,
    _raw: user,
  };
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [userData, setUserData] = useState<Models.Document | null>(null);
  const [users, setUsers] = useState<Models.Document[]>([]);
  const [restaurants, setRestaurants] = useState<Models.Document[]>([]);

  const [rates, setRates] = useState<Models.Document>(DEFAULT_RATES);
  const [isUpdatingUyo, setIsUpdatingUyo] = useState(false);
  const [isUpdatingPh, setIsUpdatingPh] = useState(false);
  const [transactions, setTransactions] = useState<Models.Document[]>([]);

  const fetchAdminUsers = useCallback(async () => {
    const data = await apiRequest<{ users?: ApiUser[]; data?: ApiUser[] }>(
      "/admin/users?limit=200"
    );

    const rawUsers = data.users || data.data || [];
    const extras = readExtras();
    const mapped = rawUsers.map((item) =>
      toUserDocument(item, extras[item.id] || {})
    );

    setUsers(mapped);
    setRestaurants(mapped.filter((item) => item.role === "restaurant"));
  }, []);

  const fetchTransactions = useCallback(
    async (role: string) => {
      try {
        if (role === "restaurant") {
          const data = await apiRequest<{ transactions?: Array<Record<string, unknown>> }>(
            "/payouts/transactions?page=1&limit=50"
          );
          const mapped = (data.transactions || []).map((tx, index) => ({
            $id: String(tx.id || `tx_${index}`),
            $createdAt: String(tx.createdAt || new Date().toISOString()),
            $updatedAt: String(tx.createdAt || new Date().toISOString()),
            amount: Number(tx.merchantEarning || 0),
            status: String(tx.status || "success").toLowerCase(),
            type: "credit",
            category: "Package",
            description: `${(tx.restaurant as { name?: string } | undefined)?.name || "Order"} earnings`,
          }));
          setTransactions(mapped);
          return;
        }

        if (role === "rider") {
          const data = await apiRequest<{ transactions?: Array<Record<string, unknown>> }>(
            "/rider/wallet/history?page=1&limit=50"
          );
          const mapped = (data.transactions || []).map((tx, index) => ({
            $id: String(tx.id || `tx_${index}`),
            $createdAt: String(tx.createdAt || new Date().toISOString()),
            $updatedAt: String(tx.createdAt || new Date().toISOString()),
            amount: Number(tx.riderEarning || 0),
            status: String(tx.status || "success").toLowerCase(),
            type: "credit",
            category: "Package",
            description: "Delivery earnings",
          }));
          setTransactions(mapped);
          return;
        }

        setTransactions([]);
      } catch {
        setTransactions([]);
      }
    },
    []
  );

  const fetchCurrentUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setUserData(null);
      setUsers([]);
      setRestaurants([]);
      setTransactions([]);
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest<{ user: ApiUser }>("/auth/me");
      const extras = readExtras();
      const mapped = toUserDocument(data.user, extras[data.user.id] || {});

      setUser({
        $id: mapped.$id,
        name: mapped.name,
        email: mapped.email,
        prefs: {},
        $createdAt: mapped.$createdAt,
        $updatedAt: mapped.$updatedAt,
      });
      setUserData(mapped);

      if (mapped.role === "admin") {
        await fetchAdminUsers();
      } else {
        setUsers([mapped]);
        setRestaurants(mapped.role === "restaurant" ? [mapped] : []);
      }

      await fetchTransactions(mapped.role);
    } catch (error) {
      clearTokens();
      setUser(null);
      setUserData(null);
      setUsers([]);
      setRestaurants([]);
      setTransactions([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchAdminUsers, fetchTransactions]);

  useEffect(() => {
    fetchCurrentUser().catch(() => {
      // Ignore bootstrap failure until user triggers login.
    });
  }, [fetchCurrentUser]);

  const persistExtraByUserId = async (
    userId: string,
    updates: Record<string, unknown>
  ) => {
    const extras = readExtras();
    extras[userId] = {
      ...(extras[userId] || {}),
      ...updates,
    };
    writeExtras(extras);

    setUserData((prev) => (prev && prev.$id === userId ? { ...prev, ...updates } : prev));
  };

  const persistExtra = async (updates: Record<string, unknown>) => {
    if (!userData?.$id) {
      throw new Error("User not found");
    }

    await persistExtraByUserId(userData.$id, updates);
  };

  const register = async (form: FormType) => {
    setLoading(true);

    try {
      const { firstName, lastName } = splitName(form.name);
      const isMerchant = form.role === "vendor";
      const merchantType = form.merchantType || "RESTAURANT";
      const isBusinessRegistered = form.isBusinessRegistered === "true";
      const role = isMerchant
        ? "MERCHANT"
        : form.role === "rider"
        ? "RIDER"
        : "CUSTOMER";

      if (isMerchant && isBusinessRegistered && !form.cacDocument) {
        throw new Error("CAC document is required for registered businesses");
      }

      const body = isMerchant && isBusinessRegistered
        ? (() => {
            const payload = new FormData();
            payload.append("firstName", firstName);
            payload.append("lastName", lastName);
            payload.append("email", form.email.toLowerCase());
            payload.append("phone", form.phoneNumber);
            payload.append("password", form.password);
            payload.append("role", role);
            payload.append("merchantType", merchantType);
            payload.append("isBusinessRegistered", "true");
            payload.append("cacDocument", form.cacDocument as File);
            return payload;
          })()
        : {
            firstName,
            lastName,
            email: form.email.toLowerCase(),
            phone: form.phoneNumber,
            password: form.password,
            role,
            merchantType: isMerchant ? merchantType : undefined,
            isBusinessRegistered: isMerchant ? isBusinessRegistered : undefined,
          };

      const data = await apiRequest<{
        token: string;
        refreshToken: string;
        user: ApiUser;
      }>("/auth/register", {
        method: "POST",
        auth: false,
        body,
      });

      setTokens(data.token, data.refreshToken);
      await persistExtraByUserId(data.user.id, {
        location: form.location,
        address: form.address,
        companyName: form.businessName,
        companyAddress: form.address,
        companyEmail: form.email.toLowerCase(),
        businessName: form.businessName,
        businessRegNo: form.businessRegNo,
      });
      await fetchCurrentUser();
      navigate(role === "RIDER" ? "/rider/onboarding" : "/dashboard");
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (form: LoginFormTypes) => {
    setLoading(true);

    try {
      const data = await apiRequest<{
        token: string;
        refreshToken: string;
      }>("/auth/login", {
        method: "POST",
        auth: false,
        body: {
          email: form.email.toLowerCase(),
          password: form.password,
        },
      });

      setTokens(data.token, data.refreshToken);
      await fetchCurrentUser();
      navigate("/dashboard");
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);

    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await apiRequest("/auth/logout", {
          method: "POST",
          auth: false,
          body: { refreshToken },
        }).catch(() => {
          // best effort
        });
      }

      clearTokens();
      setUser(null);
      setUserData(null);
      setUsers([]);
      setRestaurants([]);
      setTransactions([]);
      navigate("/login");
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updatePhoneNumber = async (phone: string) => {
    setLoading(true);

    try {
      await apiRequest<{ user: ApiUser }>("/auth/me", {
        method: "PATCH",
        body: { phone },
      });
      await fetchCurrentUser();
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = async (location: string) => {
    setLoading(true);

    try {
      await persistExtra({ location, city: location });
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updateRatesUyo = async (rate: string | number | undefined) => {
    setIsUpdatingUyo(true);

    try {
      setRates((prev) => ({
        ...prev,
        rateForUyo: Number(rate),
        $updatedAt: new Date().toISOString(),
      }));
    } finally {
      setIsUpdatingUyo(false);
    }
  };

  const updateRatesPh = async (rate: string | number | undefined) => {
    setIsUpdatingPh(true);

    try {
      setRates((prev) => ({
        ...prev,
        rateForPh: Number(rate),
        $updatedAt: new Date().toISOString(),
      }));
    } finally {
      setIsUpdatingPh(false);
    }
  };

  const createTransaction = async (
    amount: number,
    status: "pending" | "success" | "failed",
    type: "credit" | "debit",
    category: "deposit" | "Package" | "Food",
    description: string
  ) => {
    const tx: Models.Document = {
      $id: `tx_${Date.now()}`,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      amount,
      status,
      type,
      category,
      description,
    };

    setTransactions((prev) => [tx, ...prev]);
    await persistExtra({
      wallet: Number(userData?.wallet || 0) + (type === "credit" ? amount : -amount),
    });
  };

  const getTransactions = async () => {
    if (!userData?.role) return;
    await fetchTransactions(userData.role);
  };

  const updateCompanyName = async (name: string) => {
    setLoading(true);
    try {
      await persistExtra({ companyName: name, businessName: name });
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyAddress = async (address: string) => {
    setLoading(true);
    try {
      await persistExtra({ companyAddress: address, address });
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyEmail = async (email: string) => {
    setLoading(true);
    try {
      await persistExtra({ companyEmail: email.toLowerCase() });
    } finally {
      setLoading(false);
    }
  };

  const updateRestaurant = async (restaurant: Models.Document) => {
    setLoading(true);
    try {
      await apiRequest(`/admin/merchants/${restaurant.$id}/approve`, {
        method: "PATCH",
        body: { approve: true },
      });
      await fetchAdminUsers();
    } catch {
      await fetchAdminUsers();
      throw new Error("Unable to approve merchant with the current identifier");
    } finally {
      setLoading(false);
    }
  };

  const verifyUser = async (id: string) => {
    setLoading(true);

    try {
      await apiRequest(`/admin/riders/${id}/approve`, {
        method: "PATCH",
        body: { approve: true },
      });
      await fetchAdminUsers();
      navigate("/admin/users");
    } catch {
      await fetchAdminUsers();
      throw new Error("Unable to approve rider with the current identifier");
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = useMemo(
    () => ({
      user,
      loading,
      register,
      userData,
      login,
      logout,
      updatePhoneNumber,
      updateLocation,
      users,
      rates,
      isUpdatingUyo,
      isUpdatingPh,
      updateRatesUyo,
      updateRatesPh,
      transactions,
      createTransaction,
      getTransactions,
      updateCompanyName,
      updateCompanyAddress,
      updateCompanyEmail,
      restaurants,
      updateRestaurant,
      verifyUser,
      refreshUser: fetchCurrentUser,
    }),
    [
      user,
      loading,
      userData,
      users,
      rates,
      isUpdatingUyo,
      isUpdatingPh,
      transactions,
      restaurants,
      fetchCurrentUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
