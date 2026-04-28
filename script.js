  /* ── Custom Cursor ── */
      const ring = document.getElementById("cur-ring");
      const dot = document.getElementById("cur-dot");
      let mx = 0,
        my = 0,
        rx = 0,
        ry = 0;

      document.addEventListener("mousemove", (e) => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx + "px";
        dot.style.top = my + "px";
      });
      (function movRing() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + "px";
        ring.style.top = ry + "px";
        requestAnimationFrame(movRing);
      })();

      // hover state
      document
        .querySelectorAll("a,button,.svc,.a-card,.tc,.tm,.csl")
        .forEach((el) => {
          el.addEventListener("mouseenter", () =>
            document.body.classList.add("cursor-hover"),
          );
          el.addEventListener("mouseleave", () =>
            document.body.classList.remove("cursor-hover"),
          );
        });

      /* ── Nav scroll ── */
      const mainNav = document.getElementById("mainNav");
      window.addEventListener("scroll", () =>
        mainNav.classList.toggle("scrolled", scrollY > 60),
      );

      /* ── Hamburger ── */
      document
        .getElementById("hbg")
        .addEventListener("click", () =>
          document.getElementById("mobNav").classList.toggle("open"),
        );
      document
        .querySelectorAll(".mob-nav a")
        .forEach((a) =>
          a.addEventListener("click", () =>
            document.getElementById("mobNav").classList.remove("open"),
          ),
        );

      /* ── Hero slideshow ── */
      const slides = document.querySelectorAll(".hslide");
      const dots = document.querySelectorAll(".hdot");
      let cur = 0,
        htimer;
      function goSlide(n) {
        slides[cur].classList.remove("on");
        dots[cur].classList.remove("on");
        cur = (n + slides.length) % slides.length;
        slides[cur].classList.add("on");
        dots[cur].classList.add("on");
      }
      window.goSlide = goSlide;
      htimer = setInterval(() => goSlide(cur + 1), 5500);
      document
        .querySelector(".hero")
        .addEventListener("mouseenter", () => clearInterval(htimer));
      document.querySelector(".hero").addEventListener("mouseleave", () => {
        htimer = setInterval(() => goSlide(cur + 1), 5500);
      });

      /* ── Canvas particles ── */
      (function () {
        const cv = document.getElementById("particles");
        const ctx = cv.getContext("2d");
        let W,
          H,
          pts = [];
        function resize() {
          W = cv.width = cv.offsetWidth;
          H = cv.height = cv.offsetHeight;
        }
        resize();
        window.addEventListener("resize", resize);
        class P {
          constructor() {
            this.reset();
          }
          reset() {
            this.x = Math.random() * W;
            this.y = H + 10;
            this.vy = -(0.4 + Math.random() * 0.8);
            this.vx = (Math.random() - 0.5) * 0.4;
            this.r = 0.8 + Math.random() * 1.8;
            this.a = 0;
            this.life = 0;
            this.maxLife = 180 + Math.random() * 200;
          }
          update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life++;
            const p = this.life / this.maxLife;
            this.a = p < 0.1 ? p * 10 : p > 0.8 ? (1 - p) * 5 : 1;
            if (this.life > this.maxLife) this.reset();
          }
          draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(59,130,246,${this.a * 0.55})`;
            ctx.shadowBlur = 6;
            ctx.shadowColor = "#3b82f6";
            ctx.fill();
          }
        }
        for (let i = 0; i < 55; i++) {
          pts.push(new P());
          pts[i].y = Math.random() * H;
          pts[i].life = Math.random() * pts[i].maxLife;
        }
        (function loop() {
          ctx.clearRect(0, 0, W, H);
          pts.forEach((p) => {
            p.update();
            p.draw();
          });
          requestAnimationFrame(loop);
        })();
      })();

      /* ── Scroll Reveal ── */
      const rvEls = document.querySelectorAll(".rv");
      const rvObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const sib = [
              ...e.target.parentElement.querySelectorAll(".rv:not(.vis)"),
            ];
            const i = sib.indexOf(e.target);
            e.target.style.transitionDelay = i * 0.08 + "s";
            e.target.classList.add("vis");
            rvObs.unobserve(e.target);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -50px 0px" },
      );
      rvEls.forEach((r) => rvObs.observe(r));

      /* ── Counter ── */
      document.querySelectorAll(".stat-n[data-target]").forEach((el) => {
        const o = new IntersectionObserver(
          ([e]) => {
            if (!e.isIntersecting) return;
            const t = +el.dataset.target,
              sfx = el.textContent.replace(/\d/g, "");
            const dur = 1800;
            const run = (ts, t0) => {
              if (!t0) t0 = ts;
              const p = Math.min((ts - t0) / dur, 1);
              el.textContent = Math.floor(p * t) + sfx;
              if (p < 1) requestAnimationFrame((t2) => run(t2, t0));
            };
            requestAnimationFrame((t2) => run(t2, null));
            o.unobserve(el);
          },
          { threshold: 0.5 },
        );
        o.observe(el);
      });

      /* ── Carousel ── */
      const ctr = document.getElementById("cTrack");
      const csls = [...ctr.querySelectorAll(".csl")];
      let ci = 1;
      function updCar() {
        const w = csls[0].offsetWidth + 22;
        ctr.style.transform = `translateX(${-(ci - 1) * w}px)`;
        csls.forEach((s, i) => s.classList.toggle("center", i === ci));
      }
      document.getElementById("cPrev").addEventListener("click", () => {
        ci = ci > 0 ? ci - 1 : csls.length - 2;
        updCar();
      });
      document.getElementById("cNext").addEventListener("click", () => {
        ci = ci < csls.length - 1 ? ci + 1 : 1;
        updCar();
      });
      window.addEventListener("resize", updCar);
      setTimeout(updCar, 100);

      /* ── Active nav ── */
      const navAs = document.querySelectorAll(".nav-pill a");
      window.addEventListener("scroll", () => {
        let c = "";
        document.querySelectorAll("section[id]").forEach((s) => {
          if (scrollY >= s.offsetTop - 130) c = s.id;
        });
        navAs.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === "#" + c),
        );
      });

      /* ── Ripple on buttons ── */
      document
        .querySelectorAll(".btn-g,.btn-o,.btn-sub,.btn-wa,.cbtn")
        .forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const r = document.createElement("span");
            r.className = "rpl";
            const rc = btn.getBoundingClientRect();
            const sz = 4;
            r.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX - rc.left}px;top:${e.clientY - rc.top}px;`;
            btn.appendChild(r);
            setTimeout(() => r.remove(), 750);
          });
        });

      /* ── Form submit ── */
      function submitForm(e) {
        e.preventDefault();
        const b = document.getElementById("sendBtn");
        b.innerHTML = "✓ MESSAGE SENT!";
        b.style.background = "#16a34a";
        b.style.boxShadow = "0 0 32px rgba(22,163,74,.7)";
        setTimeout(() => {
          b.innerHTML =
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg> SEND MESSAGE';
          b.style.background = "";
          b.style.boxShadow = "";
        }, 3200);
      }
      window.submitForm = submitForm;