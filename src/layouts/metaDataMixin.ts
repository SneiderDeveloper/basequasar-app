import { createMetaMixin } from 'quasar';

function generateMetaData ()
{
  let routeTitle = ((this.$route.meta && this.$route.meta.title) ? this.$route.meta.title : '');
  if (this.$route.meta && this.$route.meta.headerTitle) routeTitle = this.$route.meta.headerTitle;
  const siteName = this.$getSetting('core::site-name');
  const siteDescription = this.$getSetting('core::site-description');
  const iconHref = this.$store.getters['qsiteApp/getSettingMediaByName']('isite::favicon');
  const favicon = iconHref.path || require('/public/favicon.ico');

  return {
    title: `${this.$tr(routeTitle)} | ${siteName}`,
    meta: {
      description: { name: 'description', content: siteDescription || siteName }
    },
    link: {
      icon: { rel: 'icon', href: favicon }
    }
  };
}

export default createMetaMixin(generateMetaData);
