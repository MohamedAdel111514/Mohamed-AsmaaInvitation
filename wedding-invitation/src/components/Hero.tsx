"use client";

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-background-decoration decoration-top-left">
        ✦
      </div>

      <div className="hero-background-decoration decoration-top-right">
        ❀
      </div>

      <div className="hero-background-decoration decoration-bottom-left">
        ♡
      </div>

      <div className="hero-background-decoration decoration-bottom-right">
        ✧
      </div>

      <div className="hero-content">
        <p className="hero-subtitle">
          together with their families
        </p>

        <div className="couple-photos">
          {/* صورة العريس */}
          <div className="photo-frame groom-frame">
            <div className="photo-flower flower-top-left">
              ❀
            </div>

            <div className="photo-flower flower-bottom-right">
              ✿
            </div>

            <div className="photo-leaf leaf-left">
              ⌁
            </div>

            <div className="photo-inner">
              <img
                src="/images/groom.jpg"
                alt="Mohamed"
                className="couple-photo"
              />
            </div>

            <span className="photo-heart heart-groom">
              ♡
            </span>
          </div>

          {/* علامة & */}
          <div className="couple-and">
            &amp;
          </div>

          {/* صورة العروسة */}
          <div className="photo-frame bride-frame">
            <div className="photo-flower flower-top-right">
              ❀
            </div>

            <div className="photo-flower flower-bottom-left">
              ✿
            </div>

            <div className="photo-leaf leaf-right">
              ⌁
            </div>

            <div className="photo-inner">
              <img
                src="/images/bride.jpg"
                alt="Asmaa"
                className="couple-photo"
              />
            </div>

            <span className="photo-heart heart-bride">
              ♡
            </span>
          </div>
        </div>

        <h1 className="hero-title">
          Mohamed <span>&amp;</span> Asmaa
        </h1>

        <p className="hero-description">
          We are getting married, and we would be happy to have you with us
          as we begin this new chapter, hand in hand.
        </p>

        <p className="hero-date">
          10 November 2026
        </p>

        <a href="#calendar" className="hero-scroll">
          Scroll to see the details
          <span>↓</span>
        </a>
      </div>
    </section>
  );
}
