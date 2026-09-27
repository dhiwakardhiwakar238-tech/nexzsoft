import "./SecurityPolicyPage.css";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

function SecurityPolicyPage() {
    return (
        <div className="security-page">

            <Link to="/" className="security-home">
                <FaHome />
                <span>Home</span>
            </Link>

            <h1>Security Policy</h1>

            <p>
                <strong>Last Updated:</strong> 16 August 2026
            </p>

            <p className="security-intro">
                Nexzsoft Private Limited ("Nexzsoft", "we", "our", or "us")
                is committed to maintaining appropriate administrative,
                technical, organizational, and operational safeguards designed
                to protect the confidentiality, integrity, availability, and
                appropriate use of information processed through the Nexzsoft
                platform.
            </p>

            <p>
                This Security Policy describes the security principles and
                practices that govern the Nexzsoft platform, applications,
                infrastructure, integrations, business data, customer
                information, communications data, and supporting systems.
            </p>

            <h2>1. Scope</h2>

            <p>
                This Security Policy applies to Nexzsoft systems and services
                used to provide its SaaS platform, including account
                management, customer and contact management, communication
                functionality, WhatsApp and Meta integrations, messaging
                workflows, templates, broadcasts, APIs, dashboards,
                administrative functions, AI-enabled functionality, and
                supporting infrastructure.
            </p>

            <p>
                The Policy also applies to personnel, contractors, systems,
                applications, and service providers that have authorized
                access to Nexzsoft environments or information.
            </p>

            <h2>2. Security Objectives</h2>

            <p>
                Nexzsoft's security program is designed around the following
                objectives:
            </p>

            <ul>
                <li>
                    Protect information against unauthorized access and use.
                </li>
                <li>
                    Protect information against unauthorized alteration,
                    disclosure, loss, or destruction.
                </li>
                <li>
                    Maintain appropriate availability and reliability of
                    Nexzsoft Services.
                </li>
                <li>
                    Maintain appropriate separation between customer
                    environments and tenant data.
                </li>
                <li>
                    Detect, investigate, and respond to security incidents.
                </li>
                <li>
                    Reduce security risks through preventative and corrective
                    controls.
                </li>
                <li>
                    Maintain appropriate security practices throughout the
                    lifecycle of customer information.
                </li>
            </ul>

            <h2>3. Information Security Governance</h2>

            <p>
                Nexzsoft maintains security practices appropriate to the
                nature, sensitivity, volume, and operational importance of
                information processed through its Services.
            </p>

            <p>
                Security responsibilities are assigned to appropriate
                personnel and are incorporated into system administration,
                application development, infrastructure management, access
                management, incident handling, and operational processes.
            </p>

            <h2>4. Access Control</h2>

            <p>
                Nexzsoft uses access controls intended to restrict access to
                systems and information based on authorized business
                requirements.
            </p>

            <p>
                Access to production systems, administrative functionality,
                customer information, infrastructure, and other sensitive
                resources is intended to be limited to authorized personnel
                who require such access for legitimate operational purposes.
            </p>

            <p>
                Nexzsoft may use authentication mechanisms, authorization
                controls, session management, role-based permissions, and
                other security mechanisms appropriate to the applicable
                system.
            </p>

            <h2>5. Customer and Tenant Isolation</h2>

            <p>
                Nexzsoft operates as a multi-tenant SaaS platform. Customer
                information is logically associated with the applicable
                customer or tenant account.
            </p>

            <p>
                Application-level authorization and data-access controls are
                designed to prevent one customer's authorized users from
                accessing another customer's information.
            </p>

            <p>
                Nexzsoft continuously evaluates application and database
                access patterns to reduce the risk of unauthorized
                cross-tenant access.
            </p>

            <h2>6. Authentication and Session Security</h2>

            <p>
                Nexzsoft uses authentication and session-management controls
                designed to protect user accounts and application sessions.
            </p>

            <p>
                Users are responsible for maintaining the confidentiality of
                their account credentials and for notifying Nexzsoft if they
                suspect unauthorized access to their account.
            </p>

            <p>
                Nexzsoft may terminate or restrict sessions, credentials, or
                access when necessary to protect the platform, investigate
                suspicious activity, comply with legal requirements, or
                enforce its Terms of Service.
            </p>

            <h2>7. Data Protection</h2>

            <p>
                Nexzsoft applies reasonable safeguards to protect information
                against unauthorized access, alteration, disclosure, misuse,
                loss, or destruction.
            </p>

            <p>
                Depending on the system and processing activity, safeguards
                may include access controls, authentication mechanisms,
                secure application practices, network protections, logging,
                monitoring, backups, environment separation, and other
                technical and organizational measures.
            </p>

            <h2>8. Encryption and Secure Transmission</h2>

            <p>
                Nexzsoft is designed to use appropriate security mechanisms
                for protecting information while it is transmitted between
                users, applications, APIs, and supporting services.
            </p>

            <p>
                Where encryption is supported by the relevant infrastructure,
                Nexzsoft uses encryption and secure transport mechanisms
                appropriate to the sensitivity of the information and the
                capabilities of the underlying service provider.
            </p>

            <h2>9. Application Security</h2>

            <p>
                Nexzsoft incorporates security considerations into the
                development and maintenance of its applications and APIs.
            </p>

            <p>
                Security considerations may include input validation,
                authentication, authorization, error handling, dependency
                management, protection against common application
                vulnerabilities, secure configuration, logging, and controlled
                deployment practices.
            </p>

            <h2>10. API Security</h2>

            <p>
                Nexzsoft APIs may provide access to customer accounts,
                contacts, communication functionality, templates,
                integrations, and other platform resources.
            </p>

            <p>
                API access is subject to authentication, authorization,
                validation, rate controls, application-level restrictions,
                and other controls appropriate to the relevant API.
            </p>

            <p>
                Nexzsoft may restrict, suspend, or terminate API access where
                activity presents a security, abuse, compliance, or
                operational risk.
            </p>

            <h2>11. WhatsApp and Meta Integrations</h2>

            <p>
                Nexzsoft may connect customer accounts with Meta and WhatsApp
                Business services where customers authorize such
                functionality.
            </p>

            <p>
                Access tokens, credentials, integration information, and
                related configuration data are handled through security
                controls appropriate to the applicable integration.
            </p>

            <p>
                Nexzsoft does not represent that Meta or WhatsApp systems are
                controlled by Nexzsoft. Information processed by Meta,
                WhatsApp, or other third-party platforms remains subject to
                the applicable third-party provider's terms, policies, and
                security practices.
            </p>

            <h2>12. Customer Communications and Contact Data</h2>

            <p>
                Nexzsoft may process customer contact information,
                communication records, messaging information, templates,
                broadcast information, and other business data on behalf of
                business customers.
            </p>

            <p>
                Business customers are responsible for ensuring that they
                have the necessary rights, permissions, notices, and lawful
                bases required to collect and process information relating
                to their customers, contacts, prospects, and recipients.
            </p>

            <h2>13. AI and Automated Processing Security</h2>

            <p>
                Certain Nexzsoft features may use AI, machine learning,
                large language models, or automated processing technologies.
            </p>

            <p>
                Where customer information is processed through AI-enabled
                functionality, Nexzsoft applies access, integration, and
                operational safeguards appropriate to the applicable
                processing activity.
            </p>

            <p>
                Customers should not submit information to AI-enabled
                functionality where they are prohibited from doing so by
                applicable law, contractual obligations, or their own
                internal policies.
            </p>

            <h2>14. Third-Party Service Providers</h2>

            <p>
                Nexzsoft relies on selected third-party infrastructure,
                technology, communication, payment, authentication,
                analytics, AI, hosting, and integration providers where
                necessary to operate the Services.
            </p>

            <p>
                Nexzsoft evaluates third-party services based on business,
                technical, operational, security, and compliance
                considerations appropriate to their role.
            </p>

            <p>
                Third-party providers may process information only to the
                extent necessary to provide the services for which they are
                engaged, subject to the applicable contractual and legal
                arrangements.
            </p>

            <h2>15. Logging and Monitoring</h2>

            <p>
                Nexzsoft may maintain system logs, audit records, application
                logs, security events, access records, and operational
                telemetry for purposes including security monitoring,
                troubleshooting, fraud prevention, service reliability,
                incident investigation, and compliance.
            </p>

            <p>
                Access to security and operational logs is restricted
                according to applicable access requirements.
            </p>

            <h2>16. Vulnerability Management</h2>

            <p>
                Nexzsoft monitors relevant technology components and security
                risks and may apply security updates, dependency updates,
                configuration changes, patches, or other corrective measures
                where appropriate.
            </p>

            <p>
                Security vulnerabilities may be prioritized based on factors
                including severity, exploitability, affected systems,
                customer impact, and operational risk.
            </p>

            <h2>17. Security Incident Response</h2>

            <p>
                Nexzsoft maintains procedures for identifying, assessing,
                containing, investigating, and responding to suspected or
                confirmed security incidents.
            </p>

            <p>
                Incident response activities may include investigation,
                containment, access restriction, credential rotation,
                remediation, system recovery, evidence preservation, and
                communication with affected parties where appropriate.
            </p>

            <h2>18. Security Incident Notification</h2>

            <p>
                If Nexzsoft determines that a security incident materially
                affects customer information and notification is required
                under applicable law or contractual obligations, Nexzsoft
                will provide notification in accordance with those
                requirements.
            </p>

            <p>
                Depending on the circumstances, notification may include
                information reasonably available regarding the nature of the
                incident, affected services or information, and steps taken
                to address the incident.
            </p>

            <h2>19. Backup and Recovery</h2>

            <p>
                Nexzsoft may maintain backups and recovery mechanisms designed
                to support service continuity and restoration of appropriate
                systems and information following system failures,
                operational incidents, or other disruptive events.
            </p>

            <p>
                Backup retention, availability, and restoration procedures
                may vary depending on the relevant system and operational
                requirements.
            </p>

            <h2>20. Business Continuity</h2>

            <p>
                Nexzsoft takes reasonable measures to maintain continuity of
                critical platform operations and to recover affected services
                following significant technical or operational disruptions.
            </p>

            <p>
                Business continuity and recovery measures may include
                infrastructure redundancy, backups, monitoring, incident
                response procedures, recovery processes, and service-provider
                contingency measures.
            </p>

            <h2>21. Personnel Security</h2>

            <p>
                Nexzsoft limits access to customer and company information
                according to legitimate business requirements.
            </p>

            <p>
                Personnel and contractors with authorized access to sensitive
                information are expected to follow applicable confidentiality,
                security, access-control, and information-handling
                requirements.
            </p>

            <h2>22. Data Retention and Secure Disposal</h2>

            <p>
                Nexzsoft retains information according to applicable business,
                operational, legal, contractual, and security requirements.
            </p>

            <p>
                When information is no longer required and is eligible for
                deletion, Nexzsoft may remove, anonymize, or securely dispose
                of the information using processes appropriate to the
                applicable system and data type.
            </p>

            <h2>23. Customer Security Responsibilities</h2>

            <p>
                Security of the Nexzsoft platform is a shared responsibility.
                Customers are responsible for maintaining appropriate
                security practices within their own organization and for
                activities performed using their Nexzsoft account.
            </p>

            <ul>
                <li>
                    Protecting account credentials and access tokens.
                </li>
                <li>
                    Restricting access to authorized personnel.
                </li>
                <li>
                    Using appropriate user roles and permissions.
                </li>
                <li>
                    Maintaining lawful contact and recipient information.
                </li>
                <li>
                    Obtaining required permissions and consents where
                    applicable.
                </li>
                <li>
                    Complying with applicable messaging, privacy, and
                    communications laws.
                </li>
                <li>
                    Monitoring activity performed through their account.
                </li>
                <li>
                    Immediately reporting suspected unauthorized access.
                </li>
            </ul>

            <h2>24. Acceptable Use and Abuse Prevention</h2>

            <p>
                Nexzsoft may monitor platform activity for security, abuse
                prevention, fraud detection, service protection, and
                compliance purposes.
            </p>

            <p>
                Nexzsoft may restrict or suspend accounts, integrations,
                messaging capabilities, API access, or other functionality
                where activity presents a security risk, violates applicable
                policies, creates significant operational risk, or violates
                the Nexzsoft Terms of Service.
            </p>

            <h2>25. Security Testing and Continuous Improvement</h2>

            <p>
                Nexzsoft may periodically review its applications,
                infrastructure, configurations, access controls, operational
                procedures, and security practices to identify opportunities
                for improvement.
            </p>

            <p>
                Security controls may be modified as Nexzsoft's technology,
                customer requirements, threat landscape, integrations,
                regulatory obligations, and business operations evolve.
            </p>

            <h2>26. No Absolute Security Guarantee</h2>

            <p>
                Nexzsoft applies reasonable and appropriate safeguards to
                protect information; however, no internet service,
                application, infrastructure, transmission method, or storage
                system can be guaranteed to be completely secure.
            </p>

            <p>
                Nexzsoft therefore cannot guarantee that unauthorized access,
                security vulnerabilities, cyberattacks, data loss, or other
                security events will never occur.
            </p>

            <h2>27. Security Disclosures</h2>

            <p>
                Nexzsoft may provide additional security information to
                eligible business customers under appropriate confidentiality
                arrangements where reasonably necessary for security,
                procurement, compliance, or enterprise due-diligence
                purposes.
            </p>

            <p>
                Nexzsoft may withhold information that could reasonably
                increase security risk, expose confidential infrastructure
                details, disclose security vulnerabilities, or compromise
                protective controls.
            </p>

            <h2>28. Changes to This Security Policy</h2>

            <p>
                Nexzsoft may update this Security Policy as its security
                practices, technology, infrastructure, Services, threat
                environment, legal obligations, or business operations
                evolve.
            </p>

            <p>
                The latest version will be published through the applicable
                Nexzsoft website or application.
            </p>

            <h2>29. Contact Nexzsoft</h2>

            <p>
                Security-related questions or concerns may be directed to:
            </p>

            <p>
                <strong>Nexzsoft Private Limited</strong>
            </p>

            <p>
                Email: support@nexzsoft.com
            </p>

            <p>
                Address: Erode, Tamil Nadu, India
            </p>

        </div>
    );
}

export default SecurityPolicyPage;