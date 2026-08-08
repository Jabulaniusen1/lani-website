import { Header, Footer } from "@/Components/Home"
import { FileText, Mail, ExternalLink, MapPin } from "lucide-react"

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
    RIDERS: "bg-green-50 text-green-600 border-green-100",
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
    RIDERS: "border-green-100",
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

const Li = ({ children }: { children: React.ReactNode }) => <li>{children}</li>

/* ── page ── */

const TermsAndConditions = () => {
  return (
    <>
      <Header />

      <main>
        {/* ── HERO ── */}
        <section className="main pt-20 pb-10 md:pt-28 md:pb-14 border-b border-line">
          <div className="flex items-center gap-3 mb-4">
            <FileText size={18} className="text-primary flex-shrink-0" />
            <span className="font-sora font-semibold text-primary text-sm">Terms &amp; Conditions</span>
          </div>
          <h1 className="font-sora font-bold text-main text-3xl md:text-4xl max-w-xl">
            The rules for using Lani
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
              These Terms and Conditions ("Terms") govern your access to and use of Lani ("we",
              "our", or "us"), a platform operating in Nigeria under the domain{" "}
              <strong className="text-main">lani.ng</strong> that connects customers with local
              restaurants, pharmacies, supermarkets, and other vendors ("Merchants"), and
              facilitates deliveries through our network of delivery partners ("Riders").
            </p>
            <p>
              By creating an account, accessing, or using any of our apps — the Lani Customer App,
              Merchant App, or Rider App — you agree to be bound by these Terms. If you do not
              agree, please do not use our services.
            </p>
          </Section>

          {/* 2 */}
          <Section number="2" title="Eligibility">
            <p>To use Lani, you must:</p>
            <Ul>
              <Li>Be at least 18 years old.</Li>
              <Li>Be able to form a legally binding contract under Nigerian law.</Li>
              <Li>Provide accurate and complete registration information.</Li>
              <Li>
                Not be prohibited from using the platform under any applicable law or prior
                suspension by Lani.
              </Li>
            </Ul>
          </Section>

          {/* 3 */}
          <Section number="3" title="Accounts">
            <p>
              You are responsible for maintaining the confidentiality of your account credentials
              and for all activity that occurs under your account. Notify us immediately at{" "}
              <a href="mailto:hello@lani.ng" className="text-primary font-medium hover:underline">
                hello@lani.ng
              </a>{" "}
              if you suspect unauthorised use of your account.
            </p>
            <RoleBlock role="MERCHANTS">
              Merchant accounts require valid business information and, where applicable, CAC
              registration and bank details for payout. Lani may verify this information before
              activating your account.
            </RoleBlock>
            <RoleBlock role="RIDERS">
              Rider accounts require a valid government-issued ID and, where applicable, vehicle
              documentation. Lani may verify this information before you can accept deliveries.
            </RoleBlock>
          </Section>

          {/* 4 */}
          <Section number="4" title="Use of the Platform">
            <p>
              Lani grants you a limited, non-exclusive, non-transferable licence to access and use
              the platform for its intended purpose: ordering, selling, or delivering goods. You
              agree not to:
            </p>
            <Ul>
              <Li>Use the platform for any unlawful purpose or to defraud another user.</Li>
              <Li>Interfere with or disrupt the platform's operation or security.</Li>
              <Li>
                Attempt to gain unauthorised access to any account, system, or data not belonging
                to you.
              </Li>
              <Li>Scrape, copy, or resell platform content or data without our consent.</Li>
              <Li>
                Impersonate any person or entity, or misrepresent your affiliation with one.
              </Li>
              <Li>
                Circumvent the platform to transact directly with another user in a manner that
                avoids Lani's fees.
              </Li>
            </Ul>
          </Section>

          {/* 5 */}
          <Section number="5" title="Orders and Payments">
            <RoleBlock role="CUSTOMERS">
              <p>
                When you place an order, you authorise Lani and its payment processors (e.g.,
                Paystack, Flutterwave) to charge your selected payment method for the order total,
                delivery fee, and any applicable service charge. Prices and availability are set
                by Merchants and may change without notice.
              </p>
            </RoleBlock>
            <RoleBlock role="MERCHANTS">
              <p>
                You are responsible for the accuracy of your menu, pricing, and product
                availability. Lani deducts an agreed commission from each completed order before
                disbursing your payout. Payouts are made to the bank account on file, subject to
                our payout schedule.
              </p>
            </RoleBlock>
            <RoleBlock role="RIDERS">
              <p>
                You earn a delivery fee for each completed delivery, credited to your Lani wallet.
                You may withdraw available earnings to your registered bank account at any time,
                subject to standard processing times.
              </p>
            </RoleBlock>
          </Section>

          {/* 6 */}
          <Section number="6" title="Cancellations and Refunds">
            <p>
              Orders may be cancelled before a Merchant begins preparation, subject to in-app
              cancellation windows. Once preparation or dispatch has begun, cancellation may not be
              possible, and refunds are assessed on a case-by-case basis.
            </p>
            <Ul>
              <Li>
                Refunds for incorrect, missing, or damaged items are handled through in-app
                support and may be issued as a wallet credit or reversal to your original payment
                method.
              </Li>
              <Li>
                Repeated unjustified cancellations by a Customer, Merchant, or Rider may result in
                account restrictions.
              </Li>
            </Ul>
          </Section>

          {/* 7 */}
          <Section number="7" title="Delivery">
            <p>
              Delivery times are estimates and may vary due to traffic, weather, order volume, or
              other factors outside Lani's control. Riders are independent delivery partners, not
              employees of Lani. Customers must provide accurate delivery addresses and be
              reasonably available to receive their order.
            </p>
          </Section>

          {/* 8 */}
          <Section number="8" title="Ratings, Reviews, and Conduct">
            <p>
              Customers, Merchants, and Riders may rate and review one another after a completed
              order. Reviews must be honest, respectful, and free of abusive, discriminatory, or
              defamatory content. Lani may remove content that violates these standards and may
              suspend accounts with a pattern of abusive behaviour toward other users.
            </p>
          </Section>

          {/* 9 */}
          <Section number="9" title="Intellectual Property">
            <p>
              The Lani name, logo, app design, and platform content are owned by Lani or its
              licensors and protected by applicable intellectual property laws. You may not use
              our branding without prior written consent. Content you submit (e.g., reviews, menu
              images) remains yours, but you grant Lani a licence to display it on the platform in
              connection with our services.
            </p>
          </Section>

          {/* 10 */}
          <Section number="10" title="Limitation of Liability">
            <p>
              Lani acts as an intermediary connecting Customers, Merchants, and Riders. To the
              fullest extent permitted by Nigerian law, Lani is not liable for indirect,
              incidental, or consequential damages arising from your use of the platform,
              including loss of profits, data, or goodwill. Our total liability for any claim
              arising from these Terms is limited to the amount you paid for the order giving rise
              to the claim.
            </p>
          </Section>

          {/* 11 */}
          <Section number="11" title="Indemnification">
            <p>
              You agree to indemnify and hold Lani harmless from any claims, damages, or expenses
              (including reasonable legal fees) arising from your breach of these Terms, misuse of
              the platform, or violation of any law or third-party right.
            </p>
          </Section>

          {/* 12 */}
          <Section number="12" title="Suspension and Termination">
            <p>
              Lani may suspend or terminate your account, with or without notice, if you violate
              these Terms, engage in fraudulent activity, or pose a risk to the platform or its
              users. You may close your account at any time by request to{" "}
              <a href="mailto:hello@lani.ng" className="text-primary font-medium hover:underline">
                hello@lani.ng
              </a>
              , subject to settlement of any outstanding orders, payouts, or obligations.
            </p>
          </Section>

          {/* 13 */}
          <Section number="13" title="Governing Law and Dispute Resolution">
            <p>
              These Terms are governed by the laws of the Federal Republic of Nigeria. Any dispute
              arising from these Terms or your use of the platform shall first be addressed through
              good-faith negotiation. Where a resolution cannot be reached, disputes shall be
              subject to the exclusive jurisdiction of the courts of Nigeria.
            </p>
          </Section>

          {/* 14 */}
          <Section number="14" title="Changes to These Terms">
            <p>
              We may update these Terms from time to time to reflect changes in our services or
              applicable law. When we make material changes, we will update the "Effective Date"
              above and notify you via push notification or in-app banner. Continued use of Lani
              after an update constitutes acceptance of the revised Terms.
            </p>
          </Section>

          {/* 15 */}
          <Section number="15" title="Contact Us">
            <p>For questions about these Terms, please contact:</p>

            <div className="bg-secondary border border-line rounded-2xl p-6 mt-4 space-y-3">
              <p className="font-sora font-bold text-main">Lani</p>
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
                  href="mailto:hello@lani.ng"
                  className="flex items-center gap-2 text-primary hover:underline text-sm"
                >
                  <Mail size={13} /> hello@lani.ng
                </a>
                <p className="flex items-center gap-2 text-sm">
                  <MapPin size={13} className="text-sub flex-shrink-0" />
                  Uyo, Akwa Ibom State, Nigeria
                </p>
              </div>
            </div>
          </Section>

          {/* footer note */}
          <div className="pt-10 text-center space-y-2">
            <p className="font-dm text-sub text-xs">© 2026 Lani. All rights reserved.</p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default TermsAndConditions
