declare namespace Models {
  interface Preferences {
    [key: string]: unknown;
  }

  interface User<TPreferences = Preferences> {
    $id: string;
    name: string;
    email: string;
    prefs?: TPreferences;
    $createdAt?: string;
    $updatedAt?: string;
    [key: string]: any;
  }

  interface Document {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    [key: string]: any;
  }
}

interface FormType {
  role?: string;
  subRole?: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  businessName: string;
  businessRegNo: string;
  merchantType: string;
  isBusinessRegistered: string;
  cacDocument: File | null;
  address: string;
  location: string;
  lat: number;
  lon: number;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  styles?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  styles?: string;
  options: {
    value: string;
    label: string;
  }[];
}

interface RegisterFormTypes {
  name: string;
  email: string;
  phone: string;
  company?: string;
  password: string;
  role: string;
  city?: string;
}

interface RestaurantRegistrationFormTypes {
  restaurantName: string;
  email: string;
  phone: string;
  address: string;
  lat: number;
  lon: number;
  password: string;
  role?: string;
  city?: string;
}

interface LoginFormTypes {
  email: string;
  password: string;
}

interface OrderFilterTypes {
  filter?: string;
  setFilter?: (filter: string) => void;
  filters?: string[];
  orderType: string;
  setOrderType: (orderType: string) => void;
  types: string[];
  toggleFilter: () => void;
}

interface ModalProps {
  title: string;
  children: React.ReactNode;
  toggleModal: () => void;
  isOpen: boolean;
}

interface PackageDetails {
  image: File | null;
  name: string;
  texture: string;
  notes: string;
}

interface PickupDetails {
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  pickupLocationLat: number;
  pickupLocationLng: number;
}

interface DeliveryDetails {
  receiverName: string;
  receiverPhone: string;
  deliveryLocation: string;
  deliveryLocationLat: number;
  deliveryLocationLng: number;
}

interface DispatchFormContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  packageDetails: PackageDetails;
  setPackageDetails: (details: PackageDetails) => void;
  imgPreview: string | null;
  setImgPreview: (preview: string | null) => void;
  handlePackageDetails: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  pickupDetails: PickupDetails;
  setPickupDetails: (details: PickupDetails) => void;
  handlePickupDetails: (e: React.ChangeEvent<HTMLInputElement>) => void;
  deliveryDetails: DeliveryDetails;
  setDeliveryDetails: (details: DeliveryDetails) => void;
  handleDeliveryDetails: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmitWithPayment: () => void;
  handleSubmitWithoutPayment: () => void;
  packageErrors: PackageDetails | undefined;
  setPackageErrors: (errors: PackageDetails) => void;
  pickupErrors: PickupDetails | undefined;
  setPickupErrors: (errors: PickupDetails) => void;
  deliveryErrors: DeliveryDetails | undefined;
  setDeliveryErrors: (errors: DeliveryDetails) => void;
  pickupAutocomplete: google.maps.places.Autocomplete | null;
  setPickupAutocomplete: (
    autocomplete: google.maps.places.Autocomplete | null
  ) => void;
  deliveryAutocomplete: google.maps.places.Autocomplete | null;
  setDeliveryAutocomplete: (
    autocomplete: google.maps.places.Autocomplete | null
  ) => void;
  handlePlaceSelect: (type: "pickup" | "delivery") => void;
  loading: boolean;
}

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  userData: Models.Document | null;
  loading: boolean;
  register: (form: FormType) => Promise<void>;
  login: (form: LoginFormTypes) => Promise<void>;
  logout: () => Promise<void>;
  updatePhoneNumber: (phone: string) => Promise<void>;
  updateLocation: (location: string) => Promise<void>;
  users: Models.Document[];
  rates: Models.Document | null;
  isUpdatingUyo: boolean;
  isUpdatingPh: boolean;
  updateRatesUyo: (rate: string | number | undefined) => Promise<void>;
  updateRatesPh: (rate: string | number | undefined) => Promise<void>;
  transactions: Models.Document[];
  createTransaction: (
    amount: number,
    status: "pending" | "success" | "failed",
    type: "credit" | "debit",
    category: "deposit" | "Package" | "Food",
    description: string
  ) => Promise<void>;
  getTransactions: () => Promise<void>;
  updateCompanyName: (name: string) => Promise<void>;
  updateCompanyAddress: (address: string) => Promise<void>;
  updateCompanyEmail: (email: string) => Promise<void>;
  restaurants: Models.Document[];
  updateRestaurant: (restaurant: Models.Document) => Promise<void>;
  verifyUser: (id: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface PackageOrderContextType {
  orders: Models.Document[];
  createOrder: (
    packageDetails: PackageDetails,
    deliveryDetails: DeliveryDetails,
    pickupDetails: PickupDetails,
    price: number,
    isPaid: boolean
  ) => Promise<void>;
  loading: boolean;
  allOrders: Models.Document[];
  acceptOrder: (orderId: string) => Promise<void>;
  markAsDelivered: (order: Models.Document) => Promise<Models.Document>;
  markPaymentAsReceived: (order: Models.Document) => Promise<Models.Document>;
  parcels: Models.Document[];
}

interface MapsContextType {
  isLocationEnabled: boolean;
  getRiderLocation: () => Promise<{ latitude: number; longitude: number }>;
  askForLocation: () => Promise<void>;
  reverseGeocode: (
    latitude: number,
    longitude: number
  ) => Promise<null | undefined>;
  isFetchingLocation: boolean;
  riderLocation: { address: string; city: string; country: string } | null;
}

interface NotificationContextType {
  createNotifications: (notification: Notifications, id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  notifications: Models.Document[] | null;
  unreadCount: number;
  isLoading: boolean;
  markAsRead?: (notificationId: string) => Promise<void>;
}

interface Notifications {
  notificationId?: string;
  type: string;
  title: string;
  content: string;
  activity?: string;
  path?: string;
  isRead?: boolean;
}

type NotificationType = "order" | "system" | "success" | "alert" | "food";
