import { Header, Footer } from "@/Components/Home"
import { Shield, Mail, MapPin, ExternalLink, Trash2 } from "lucide-react"

/* ── helpers ── */

const Section = ({
  id,
  number,
  title,
  children,
}: {
  id?: string
  number: string
  title: string
  children: React.ReactNode
}) => (
  <section id={id} data-aos="fade-up" className="py-10 border-b border-line last:border-0">
    <div className="flex items-baseline gap-3 mb-5">
      <span className="font-sora font-bold text-primary text-sm">{number}.</span>
      <h2 className="font-sora font-bold text-main text-xl md:text-2xl">{title}</h2>
    </div>
    <div className="space-y-4 font-dm text-sub text-sm leading-relaxed">{children}</div>
  </section>
)

const RoleBadge = ({ role }: { role: "CUSTOMERS" | "MERCHANTS" | "RIDERS" }) => {
  const styles = {
    CUSTOMERS: "bg-blue-50 text-blue-600 border-blue-100",
    MERCHANTS: "bg-orange-50 text-primary border-orange-100",
    RIDERS:    "bg-green-50 text-green-600 border-green-100",
  }
  return (
    <span
      className={`inline-block font-sora font-semibold text-xs px-3 py-1 rounded-full border ${styles[role]}`}
    >
      {role}
    </span>
  )
}

const RoleBlock = ({
  role,
  children,
}: {
  role: "CUSTOMERS" | "MERCHANTS" | "RIDERS"
  children: React.ReactNode
}) => {
  const border = {
    CUSTOMERS: "border-blue-100",
    MERCHANTS: "border-orange-100",
    RIDERS:    "border-green-100",
  }
  return (
    <div className={`border-l-4 ${border[role]} pl-5 mt-4 space-y-2`}>
      <RoleBadge role={role} />
      <div className="font-dm text-sub text-sm leading-relaxed">{children}</div>
    </div>
  )
}

const Ul = ({ children }: { children: React.ReactNode }) => (
  <ul className="list-disc list-outside pl-5 space-y-1.5">{children}</ul>
)

const Li = ({ children }: { children: React.ReactNode }) => (
  <li>{children}</li>
)

/* ── page ── */

const PrivacyPolicy = () => {
  return (
    <>
      <Header />

      <main>
        {/* ── HERO ── */}
        <section className="main pt-20 pb-10 md:pt-28 md:pb-14 border-b border-line">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={18} className="text-primary flex-shrink-0" />
            <span className="font-sora font-semibold text-primary text-sm">Privacy Policy</span>
          </div>
          <h1 className="font-sora font-bold text-main text-3xl md:text-4xl max-w-xl">
            How Lani handles your data
          </h1>
          <p className="font-dm text-sub text-sm mt-3 max-w-xl leading-relaxed">
            Effective 16 May 2026 · Version 1.0 · Applies to the Customer, Merchant, and Rider apps.
          </p>
        </section>

        {/* ── CONTENT ── */}
        <div className="main max-w-3xl py-8 md:py-12">

          {/* 1 */}
          <Section number="1" title="Introduction">
            <p>
              Lani ("we", "our", or "us") is a food delivery platform operating in Nigeria under the
              domain <strong className="text-main">lani.ng</strong>. We connect customers with local
              restaurants, eateries, and food vendors (collectively "Merchants") and facilitate
              deliveries through our network of delivery partners ("Riders").
            </p>
            <p>
              This Privacy Policy explains how we collect, use, disclose, and safeguard your personal
              data across all three of our mobile applications:
            </p>
            <Ul>
              <Li><strong className="text-main">Lani Customer App</strong> — for individuals ordering food</Li>
              <Li><strong className="text-main">Lani Merchant App</strong> — for restaurant and food vendor partners</Li>
              <Li><strong className="text-main">Lani Rider App</strong> — for delivery partners</Li>
            </Ul>
            <p>
              By using any of our apps, you agree to the collection and use of your personal data as
              described in this policy. If you do not agree, please discontinue use of our services.
            </p>
            <p>
              This policy is issued in compliance with the{" "}
              <strong className="text-main">Nigeria Data Protection Act 2023 (NDPA)</strong> and the{" "}
              <strong className="text-main">Nigeria Data Protection Regulation 2019 (NDPR)</strong>.
            </p>
          </Section>

          {/* 2 */}
          <Section number="2" title="Who This Policy Applies To">
            <p>
              This single unified policy applies to all users of the Lani platform, with role-specific
              provisions where relevant:
            </p>
            <Ul>
              <Li>
                <strong className="text-main">Customers:</strong> individuals who use the Lani Customer
                App to browse menus, place orders, and make payments.
              </Li>
              <Li>
                <strong className="text-main">Merchants:</strong> businesses or individuals registered on
                the Lani Merchant App to list, manage, and fulfil food orders.
              </Li>
              <Li>
                <strong className="text-main">Riders:</strong> delivery partners who use the Lani Rider
                App to accept and complete deliveries.
              </Li>
            </Ul>
            <p>
              Where a provision applies only to a specific user type, it is clearly marked with a role
              label.
            </p>
          </Section>

          {/* 3 */}
          <Section number="3" title="Data We Collect">
            <p className="font-sora font-semibold text-main text-base">3.1 Data Collected from All Users</p>
            <Ul>
              <Li>Full name</Li>
              <Li>Email address</Li>
              <Li>Phone number</Li>
              <Li>Profile photo (optional)</Li>
              <Li>Device information (device type, OS version, unique device identifiers)</Li>
              <Li>App usage data and logs</Li>
              <Li>Push notification tokens</Li>
            </Ul>

            <RoleBlock role="CUSTOMERS">
              <p className="font-sora font-semibold text-main mb-2">Additional Data Collected</p>
              <Ul>
                <Li>Delivery address(es) including GPS coordinates</Li>
                <Li>Order history (items ordered, timestamps, merchant details)</Li>
                <Li>
                  Payment method details (processed and tokenised by our payment processor; we do not
                  store raw card data)
                </Li>
                <Li>Ratings and reviews submitted</Li>
                <Li>Real-time location data during active delivery tracking</Li>
              </Ul>
            </RoleBlock>

            <RoleBlock role="MERCHANTS">
              <p className="font-sora font-semibold text-main mb-2">Additional Data Collected</p>
              <Ul>
                <Li>Business name, address, and operating hours</Li>
                <Li>Business registration or CAC number (where applicable)</Li>
                <Li>Bank account details for payout disbursement</Li>
                <Li>Menu items, pricing, and product images</Li>
                <Li>Order processing data and sales analytics</Li>
                <Li>Tax identification number (TIN) where required by law</Li>
              </Ul>
            </RoleBlock>

            <RoleBlock role="RIDERS">
              <p className="font-sora font-semibold text-main mb-2">Additional Data Collected</p>
              <Ul>
                <Li>
                  Government-issued ID (e.g., NIN, driver's licence) for identity verification
                </Li>
                <Li>Bank account details for earnings payout</Li>
                <Li>Vehicle type and details</Li>
                <Li>Real-time GPS location data during active delivery sessions</Li>
                <Li>
                  Delivery performance data (completion rates, ratings, on-time metrics)
                </Li>
                <Li>Earnings history and wallet transaction records</Li>
              </Ul>
            </RoleBlock>
          </Section>

          {/* 4 */}
          <Section number="4" title="How We Use Your Data">
            <p>
              We process your personal data only for the purposes listed below, relying on appropriate
              legal bases under the NDPA 2023:
            </p>

            {/* table */}
            <div className="overflow-x-auto mt-4 rounded-2xl border border-line">
              <table className="w-full text-xs font-dm">
                <thead>
                  <tr className="bg-secondary text-left">
                    <th className="font-sora font-semibold text-main px-4 py-3 border-b border-line min-w-[200px]">
                      Purpose
                    </th>
                    <th className="font-sora font-semibold text-main px-4 py-3 border-b border-line min-w-[200px]">
                      Data Used
                    </th>
                    <th className="font-sora font-semibold text-main px-4 py-3 border-b border-line min-w-[160px]">
                      Legal Basis
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sub">
                  {[
                    ["Account creation and authentication", "Name, email, phone, device ID", "Contract performance"],
                    ["Order processing and fulfilment", "Location, order history, payment data", "Contract performance"],
                    ["Connecting riders to deliveries", "Rider GPS, delivery zones", "Contract performance"],
                    ["Processing payments and payouts", "Bank details, transaction data", "Contract performance"],
                    ["Customer support and dispute resolution", "All relevant account data", "Legitimate interests"],
                    ["Safety, fraud detection, and security", "Device info, usage logs, location", "Legitimate interests / Legal obligation"],
                    ["Platform improvements and analytics", "Aggregated usage data", "Legitimate interests"],
                    ["Sending service notifications", "Email, phone, push token", "Contract performance"],
                    ["Legal and regulatory compliance", "Identity documents, financial records", "Legal obligation"],
                    ["Marketing (only with consent)", "Email, push notifications", "Consent"],
                  ].map(([purpose, data, basis], i) => (
                    <tr key={i} className="border-b border-line last:border-0 hover:bg-secondary/50 transition-colors">
                      <td className="px-4 py-3 text-main font-medium">{purpose}</td>
                      <td className="px-4 py-3">{data}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block bg-primary/10 text-primary font-sora font-semibold text-[10px] px-2 py-0.5 rounded-full">
                          {basis}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* 5 */}
          <Section number="5" title="Location Data">
            <p>Location data is central to Lani's service. Here is how we handle it:</p>
            <Ul>
              <Li>
                <strong className="text-main">Customers:</strong> we collect your location to suggest
                nearby restaurants, calculate delivery routes, and track your order in real time.
                Location is only accessed when the app is in use.
              </Li>
              <Li>
                <strong className="text-main">Riders:</strong> we collect your real-time GPS location
                continuously during active delivery sessions to match you to nearby orders, compute
                ETAs, and display your position to the relevant customer. Location tracking stops when
                you go offline.
              </Li>
              <Li>
                <strong className="text-main">Merchants:</strong> we collect your business address to
                display your location to customers. We do not track merchant devices in real time.
              </Li>
            </Ul>
            <p>
              You can revoke location permissions at any time from your device settings, though doing
              so may limit your ability to use core features.
            </p>
          </Section>

          {/* 6 */}
          <Section number="6" title="Sharing Your Data">
            <p>
              We do not sell your personal data. We share data only in the following limited
              circumstances:
            </p>

            <p className="font-sora font-semibold text-main text-base mt-2">
              6.1 Between Platform Participants
            </p>
            <Ul>
              <Li>
                When a customer places an order, the merchant receives the customer's name, order
                details, and delivery address.
              </Li>
              <Li>
                The assigned rider receives the customer's name, delivery address, and order summary.
              </Li>
              <Li>
                The customer can see the rider's name, profile photo, vehicle type, and real-time
                location during active delivery.
              </Li>
            </Ul>

            <p className="font-sora font-semibold text-main text-base mt-4">
              6.2 Third-Party Service Providers
            </p>
            <p>
              We engage trusted third-party processors who handle data on our behalf under strict
              confidentiality agreements:
            </p>
            <Ul>
              <Li>
                <strong className="text-main">Payment processors</strong> (e.g., Paystack,
                Flutterwave) — for payment and payout processing
              </Li>
              <Li>
                <strong className="text-main">Cloud infrastructure providers</strong> — for secure
                data hosting
              </Li>
              <Li>
                <strong className="text-main">Mapping and geolocation services</strong> (e.g., Google
                Maps) — for routing and ETA calculations
              </Li>
              <Li>
                <strong className="text-main">Push notification services</strong> (e.g.,
                Firebase/Expo) — for in-app and push alerts
              </Li>
              <Li>
                <strong className="text-main">Analytics tools</strong> — for aggregate, anonymised
                platform performance data
              </Li>
            </Ul>

            <p className="font-sora font-semibold text-main text-base mt-4">
              6.3 Legal Obligations
            </p>
            <p>
              We may disclose your data to law enforcement, regulatory authorities, or courts where
              required by Nigerian law or a valid court order.
            </p>

            <p className="font-sora font-semibold text-main text-base mt-4">
              6.4 Business Transfers
            </p>
            <p>
              In the event of a merger, acquisition, or sale of Lani, your data may be transferred to
              the successor entity. We will notify you in advance and you will retain your rights under
              this policy.
            </p>
          </Section>

          {/* 7 */}
          <Section number="7" title="Data Retention">
            <p>
              We retain your data only for as long as necessary for the purposes outlined in this
              policy:
            </p>
            <Ul>
              <Li>
                <strong className="text-main">Active accounts:</strong> data is retained for the
                duration of your account plus 12 months after closure.
              </Li>
              <Li>
                <strong className="text-main">Financial records</strong> (transactions, payouts):
                retained for 7 years to comply with Nigerian financial regulations (FIRS, CAMA).
              </Li>
              <Li>
                <strong className="text-main">Identity verification documents</strong> (Riders,
                Merchants): retained for 3 years after the end of the business relationship.
              </Li>
              <Li>
                <strong className="text-main">Order data:</strong> retained for 2 years for support
                and dispute resolution purposes.
              </Li>
              <Li>
                <strong className="text-main">Location data:</strong> real-time location data is not
                stored beyond what is required to complete a delivery. Aggregated route data may be
                retained anonymously for analytics.
              </Li>
            </Ul>
          </Section>

          {/* 8 */}
          <Section number="8" title="Your Rights Under Nigerian Law">
            <p>
              Under the Nigeria Data Protection Act 2023 (NDPA), you have the following rights in
              respect of your personal data:
            </p>
            <Ul>
              <Li>
                <strong className="text-main">Right of Access:</strong> you may request a copy of all
                personal data we hold about you.
              </Li>
              <Li>
                <strong className="text-main">Right to Rectification:</strong> you may request
                correction of inaccurate or incomplete data.
              </Li>
              <Li>
                <strong className="text-main">Right to Erasure:</strong> you may request deletion of
                your data where we have no lawful basis to retain it.
              </Li>
              <Li>
                <strong className="text-main">Right to Restrict Processing:</strong> you may request
                that we limit how we use your data in certain circumstances.
              </Li>
              <Li>
                <strong className="text-main">Right to Data Portability:</strong> you may request your
                data in a structured, machine-readable format.
              </Li>
              <Li>
                <strong className="text-main">Right to Object:</strong> you may object to processing
                based on legitimate interests, including direct marketing.
              </Li>
              <Li>
                <strong className="text-main">Right to Withdraw Consent:</strong> where processing is
                based on consent, you may withdraw it at any time without affecting prior processing.
              </Li>
            </Ul>
            <p>
              To exercise any of these rights, email us at{" "}
              <a
                href="mailto:privacy@lani.ng"
                className="text-primary font-medium hover:underline"
              >
                privacy@lani.ng
              </a>
              . We will respond within 30 days. If you are unsatisfied with our response, you may
              lodge a complaint with the{" "}
              <strong className="text-main">
                Nigeria Data Protection Commission (NDPC)
              </strong>{" "}
              at{" "}
              <a
                href="https://ndpc.gov.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline inline-flex items-center gap-1"
              >
                ndpc.gov.ng <ExternalLink size={11} />
              </a>
              .
            </p>
          </Section>

          {/* 9 */}
          <Section number="9" title="Data Security">
            <p>
              We take the protection of your data seriously. Our security measures include:
            </p>
            <Ul>
              <Li>Encryption of data in transit using TLS/HTTPS</Li>
              <Li>
                Encryption of sensitive data at rest (e.g., bank details, identity documents)
              </Li>
              <Li>Access controls and role-based permissions on our backend systems</Li>
              <Li>
                Payment data handled exclusively by PCI-DSS compliant processors
                (Paystack/Flutterwave)
              </Li>
              <Li>Regular security reviews of our codebase and infrastructure</Li>
              <Li>
                Secure token-based authentication (JWT) with short expiry periods
              </Li>
            </Ul>
            <p>
              While we employ industry-standard security practices, no digital platform can guarantee
              absolute security. In the event of a data breach that poses a high risk to your rights,
              we will notify you and the NDPC as required by law.
            </p>
          </Section>

          {/* 10 */}
          <Section number="10" title="Children's Privacy">
            <p>
              Lani is not intended for use by individuals under the age of 18. We do not knowingly
              collect personal data from minors. If we become aware that a user is under 18, we will
              promptly close their account and delete their data. If you believe a minor has registered
              on our platform, please contact us at{" "}
              <a
                href="mailto:privacy@lani.ng"
                className="text-primary font-medium hover:underline"
              >
                privacy@lani.ng
              </a>
              .
            </p>
          </Section>

          {/* 11 */}
          <Section number="11" title="Third-Party Links and Services">
            <p>
              Our apps may contain links to third-party websites or services (e.g., payment
              gateways). This policy does not cover the data practices of those third parties. We
              encourage you to review their privacy policies before sharing your data with them.
            </p>
          </Section>

          {/* 12 */}
          <Section number="12" title="Cookies and Similar Technologies">
            <p>
              Our mobile applications do not use browser cookies. However, we may use device storage
              (e.g., AsyncStorage in React Native) to maintain session state and user preferences
              locally on your device. This data does not leave your device unless synced to our
              servers as part of normal app operation.
            </p>
          </Section>

          {/* 13 */}
          <Section number="13" title="International Data Transfers">
            <p>
              Lani is a Nigerian platform and primarily stores data within Nigeria. Some of our
              third-party service providers (e.g., cloud infrastructure, push notification services)
              may process your data outside Nigeria. Where this occurs, we ensure that adequate
              safeguards are in place as required by the NDPA 2023, including data processing
              agreements that obligate those providers to protect your data to Nigerian standards.
            </p>
          </Section>

          {/* 14 */}
          <Section number="14" title="Marketing Communications">
            <p>
              We will only send you marketing communications (e.g., promotions, offers, new
              restaurant alerts) if you have opted in during registration or through your app
              settings. You may unsubscribe at any time by:
            </p>
            <Ul>
              <Li>Adjusting your notification preferences in the app settings</Li>
              <Li>
                Emailing us at{" "}
                <a
                  href="mailto:privacy@lani.ng"
                  className="text-primary font-medium hover:underline"
                >
                  privacy@lani.ng
                </a>{" "}
                with the subject line "Unsubscribe"
              </Li>
            </Ul>
            <p>
              Transactional notifications (e.g., order confirmations, delivery updates, payout
              alerts) are not marketing and cannot be disabled while you hold an active account, as
              they are necessary for service delivery.
            </p>
          </Section>

          {/* 15 */}
          <Section number="15" title="Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our services,
              technology, or applicable law. When we make material changes, we will:
            </p>
            <Ul>
              <Li>Update the "Effective Date" at the top of this document</Li>
              <Li>Notify you via push notification or in-app banner</Li>
              <Li>
                For significant changes, request renewed consent where required
              </Li>
            </Ul>
            <p>
              Continued use of Lani after a policy update constitutes acceptance of the revised
              policy.
            </p>
          </Section>

          {/* 16 */}
          <Section id="account-deletion" number="16" title="Account Deletion">
            <div className="flex items-start gap-4 bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-4">
              <Trash2 size={18} className="text-primary flex-shrink-0 mt-0.5" />
              <p>
                You have the right to permanently delete your Lani account and all associated
                personal data at any time. This right applies to Customers, Merchants, and Riders.
              </p>
            </div>

            <p className="font-sora font-semibold text-main text-base">16.1 How to Delete Your Account</p>
            <p>You can request account deletion through either of the following methods:</p>
            <Ul>
              <Li>
                <strong className="text-main">In-app:</strong> go to{" "}
                <strong className="text-main">Profile → Settings → Delete Account</strong>. You will
                be asked to confirm your decision. Once confirmed, your account deletion is queued
                immediately.
              </Li>
              <Li>
                <strong className="text-main">By email:</strong> send a request to{" "}
                <a href="mailto:privacy@lani.ng" className="text-primary font-medium hover:underline">
                  privacy@lani.ng
                </a>{" "}
                from the email address linked to your account with the subject line{" "}
                <strong className="text-main">"Account Deletion Request"</strong>. We will process
                your request within 30 days.
              </Li>
            </Ul>

            <p className="font-sora font-semibold text-main text-base mt-4">16.2 What Happens After Deletion</p>
            <Ul>
              <Li>
                Your account, profile, and personal data are permanently removed from our active
                systems within <strong className="text-main">30 days</strong> of your confirmed
                request.
              </Li>
              <Li>
                Any active orders at the time of the request must be completed or cancelled before
                deletion is finalised.
              </Li>
              <Li>
                For Merchants and Riders with outstanding payouts, pending balances will be
                transferred to your registered bank account before the account is closed.
              </Li>
              <Li>
                Once deleted, your account cannot be recovered. Any reviews, ratings, or
                anonymised analytics data derived from your activity may be retained in aggregate,
                non-identifiable form.
              </Li>
            </Ul>

            <p className="font-sora font-semibold text-main text-base mt-4">16.3 Data We Are Required to Retain</p>
            <p>
              Even after account deletion, certain data must be retained for legal and regulatory
              reasons as described in Section 7 (Data Retention):
            </p>
            <Ul>
              <Li>
                <strong className="text-main">Financial transaction records</strong> — retained for
                7 years to comply with Nigerian financial regulations (FIRS, CAMA).
              </Li>
              <Li>
                <strong className="text-main">Identity verification documents</strong> (Riders and
                Merchants) — retained for 3 years after the end of the business relationship.
              </Li>
              <Li>
                <strong className="text-main">Order records</strong> — retained for 2 years for
                dispute resolution purposes.
              </Li>
            </Ul>
            <p>
              This retained data is stored securely, access-restricted, and used solely for the
              purposes stated. It will not be used for marketing or shared with third parties outside
              of legal obligations.
            </p>
          </Section>

          {/* 17 */}
          <Section number="17" title="Contact Us">
            <p>
              For all privacy-related inquiries, data subject requests, or complaints, please
              contact:
            </p>

            <div className="bg-secondary border border-line rounded-2xl p-6 mt-4 space-y-3">
              <p className="font-sora font-bold text-main">Lani — Data Controller</p>
              <div className="space-y-2">
                <a
                  href="https://lani.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline text-sm"
                >
                  <ExternalLink size={13} /> lani.ng
                </a>
                <a
                  href="mailto:privacy@lani.ng"
                  className="flex items-center gap-2 text-primary hover:underline text-sm"
                >
                  <Mail size={13} /> privacy@lani.ng
                </a>
                <p className="flex items-center gap-2 text-sm">
                  <MapPin size={13} className="text-sub flex-shrink-0" />
                  Uyo, Akwa Ibom State, Nigeria
                </p>
              </div>
            </div>

            <p className="mt-6">
              If you are unsatisfied with our response, you have the right to lodge a complaint with
              the Nigeria Data Protection Commission (NDPC):
            </p>

            <div className="bg-secondary border border-line rounded-2xl p-6 mt-4 space-y-2">
              <p className="font-sora font-bold text-main">
                Nigeria Data Protection Commission (NDPC)
              </p>
              <a
                href="https://ndpc.gov.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline text-sm"
              >
                <ExternalLink size={13} /> ndpc.gov.ng
              </a>
            </div>
          </Section>

          {/* footer note */}
          <div className="pt-10 text-center space-y-2">
            <p className="font-dm text-sub text-xs">
              This document was prepared in accordance with the Nigeria Data Protection Act 2023
              (NDPA) and the Nigeria Data Protection Regulation 2019 (NDPR).
            </p>
            <p className="font-dm text-sub text-xs">© 2026 Lani. All rights reserved.</p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default PrivacyPolicy
