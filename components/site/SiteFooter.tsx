import { SITE } from "@/data/site";
import { ArrowUpRight } from "./icons";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div className="footer__left">
          <p className="footer__name display">
            {SITE.firstName} {SITE.lastName}
          </p>
          <p className="footer__role">
            {SITE.role} · {SITE.location}
          </p>
        </div>

        <div className="footer__right">
          <a
            className="footer__link"
            href={SITE.telegram}
            target="_blank"
            rel="noreferrer noopener"
          >
            Telegram
            <ArrowUpRight />
          </a>
          <a className="footer__link" href="#top">
            Back to top
          </a>
        </div>
      </div>

      <div className="shell footer__base">
        <p>© {new Date().getFullYear()} Velar Studio</p>
        <p>Designed and built in Poland</p>
      </div>
    </footer>
  );
}
