import "bootstrap/dist/css/bootstrap.min.css";
import "../../Style/styles.css";
import Footer from "../Nav/Footer";

export default function AboutPage() {
  return (
    <main className="about-page">
      {/*HERO SECTION*/}
      <section className="about-hero">
        <div className="about-hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
        </div>

        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <div className="logo-wrapper mb-4">
                <div className="logo-circle">
                  <img src="/Leon.png" alt="Leon Logo" className="about-logo" />
                </div>
              </div>
              <h1 className="about-title mb-4">About LEON</h1>
              <p className="about-lead">
                A modern platform for IT service management, designed for
                simplicity, control, and scalability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/*MISSION SECTION*/}
      <section className="about-section mission-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="content-card">
                <div className="row align-items-center g-5">
                  <div className="col-lg-6">
                    <div className="section-badge mb-3">Our Mission</div>
                    <h2 className="section-heading mb-4">
                      Simplifying IT Service Management
                    </h2>
                    <p className="section-text">
                      LEON was created to simplify IT service management by
                      unifying ticketing, operations, and endpoint control
                      within a single intuitive platform.
                    </p>
                    <p className="section-text">
                      Our focus is to provide IT teams with a clear, reliable,
                      and easily extensible tool capable of adapting to diverse
                      operational contexts.
                    </p>
                  </div>
                  <div className="col-lg-6">
                    <div className="mission-graphic">
                      <div className="mission-item">
                        <div className="mission-icon">
                          <svg
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                          </svg>
                        </div>
                        <div>
                          <h4>Unified Platform</h4>
                          <p>All IT operations in one place</p>
                        </div>
                      </div>
                      <div className="mission-item">
                        <div className="mission-icon">
                          <svg
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                          </svg>
                        </div>
                        <div>
                          <h4>Intuitive Design</h4>
                          <p>Easy to learn and use</p>
                        </div>
                      </div>
                      <div className="mission-item">
                        <div className="mission-icon">
                          <svg
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                          </svg>
                        </div>
                        <div>
                          <h4>Scalable Architecture</h4>
                          <p>Grows with your organization</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*FEATURES GRID*/}
      <section className="about-section features-grid-section">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-badge mb-3">What LEON Offers</div>
            <h2 className="section-heading mb-3">
              Powerful Features for Modern IT Teams
            </h2>
            <p className="section-subtitle">
              Everything you need to manage IT services effectively
            </p>
          </div>

          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="feature-box">
                <div className="feature-box-icon ticket">
                  <svg
                    width="28"
                    height="28"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
                  </svg>
                </div>
                <h3 className="feature-box-title">IT Ticket Management</h3>
                <p className="feature-box-text">
                  Create and track tickets with clear status and activity
                  history.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="feature-box">
                <div className="feature-box-icon role">
                  <svg
                    width="28"
                    height="28"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                  </svg>
                </div>
                <h3 className="feature-box-title">Role-Based Access</h3>
                <p className="feature-box-text">
                  Role-based access control to ensure security and governance.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="feature-box">
                <div className="feature-box-icon process">
                  <svg
                    width="28"
                    height="28"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z" />
                  </svg>
                </div>
                <h3 className="feature-box-title">Structured Processes</h3>
                <p className="feature-box-text">
                  Manage ticket lifecycle with clear and consistent rules.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="feature-box">
                <div className="feature-box-icon scale">
                  <svg
                    width="28"
                    height="28"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z" />
                  </svg>
                </div>
                <h3 className="feature-box-title">Scalable Architecture</h3>
                <p className="feature-box-text">
                  Designed to grow with your organization's needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*TECHNOLOGY STACK*/}
      <section className="about-section tech-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="content-card tech-card">
                <div className="row align-items-center g-5">
                  <div className="col-lg-6 order-lg-2">
                    <div className="section-badge mb-3">Technology</div>
                    <h2 className="section-heading mb-4">
                      Built on Modern Architecture
                    </h2>
                    <p className="section-text">
                      LEON utilizes a modern architecture based on REST APIs,
                      JWT authentication, and reactive web interfaces.
                    </p>
                    <p className="section-text mb-0">
                      This structure enables simple integrations, advanced
                      security, and reliable performance in enterprise
                      environments.
                    </p>
                  </div>
                  <div className="col-lg-6 order-lg-1">
                    <div className="tech-stack">
                      <div className="tech-item">
                        <div className="tech-icon backend">
                          <svg
                            width="32"
                            height="32"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
                          </svg>
                        </div>
                        <div>
                          <h4>ASP.NET Core 9.0</h4>
                          <p>Enterprise-grade backend</p>
                        </div>
                      </div>
                      <div className="tech-item">
                        <div className="tech-icon frontend">
                          <svg
                            width="32"
                            height="32"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                            <path d="M6.854 4.646a.5.5 0 0 1 0 .708L4.207 8l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0zm2.292 0a.5.5 0 0 0 0 .708L11.793 8l-2.647 2.646a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4>React 19 + TypeScript</h4>
                          <p>Modern, type-safe frontend</p>
                        </div>
                      </div>
                      <div className="tech-item">
                        <div className="tech-icon database">
                          <svg
                            width="32"
                            height="32"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Z" />
                            <path d="M8 1c-1.573 0-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4s.875 1.755 1.904 2.223C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777C13.125 5.755 14 5.007 14 4s-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1Z" />
                            <path d="M2 7v-.839c.457.432 1.004.751 1.49.972C4.722 7.693 6.318 8 8 8s3.278-.307 4.51-.867c.486-.22 1.033-.54 1.49-.972V7c0 .424-.155.802-.411 1.133a4.51 4.51 0 0 0-4.815 1.843A12.31 12.31 0 0 1 8 10c-1.573 0-3.022-.289-4.096-.777C2.875 8.755 2 8.007 2 7Zm6.257 3.998L8 11c-1.682 0-3.278-.307-4.51-.867-.486-.22-1.033-.54-1.49-.972V10c0 1.007.875 1.755 1.904 2.223C4.978 12.711 6.427 13 8 13h.027a4.552 4.552 0 0 1 .23-2.002Zm-.002 3L8 14c-1.682 0-3.278-.307-4.51-.867-.486-.22-1.033-.54-1.49-.972V13c0 1.007.875 1.755 1.904 2.223C4.978 15.711 6.427 16 8 16c.536 0 1.058-.034 1.555-.097a4.507 4.507 0 0 1-1.3-1.905Z" />
                          </svg>
                        </div>
                        <div>
                          <h4>SQL Server</h4>
                          <p>Robust data management</p>
                        </div>
                      </div>
                      <div className="tech-item">
                        <div className="tech-icon security">
                          <svg
                            width="32"
                            height="32"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z" />
                            <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4>JWT Authentication</h4>
                          <p>Industry-standard security</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*VISION SECTION*/}
      <section className="about-section vision-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div className="section-badge mb-3">Our Vision</div>
              <h2 className="section-heading mb-4">
                The Future of IT Service Management
              </h2>
              <p className="section-text mb-4">
                LEON is designed as an evolving platform, ready to embrace
                advanced features like automation, reporting, and integrations
                with external systems.
              </p>
              <p className="section-text-large">
                Our goal is to become a reference point for modern IT service
                management.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
