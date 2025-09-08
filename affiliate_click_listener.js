(function(){
  function onClick(e){
    var a = e.target.closest && e.target.closest('a');
    if(!a) return;
    var href = a.getAttribute('href') || '';
    var isAff = (a.dataset && a.dataset.aff === 'true') || /\/go\//i.test(href);
    if(!isAff) return;
    var outHost = '';
    try { outHost = new URL(a.href, location.href).hostname; } catch(err){}
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'affiliate_click',
      merchant: (a.dataset && a.dataset.merchant) || '',
      offer: (a.dataset && a.dataset.offer) || '',
      position: (a.dataset && a.dataset.position) || '',
      price: (a.dataset && a.dataset.price) || '',
      out_url_domain: outHost,
      link_url: a.href || href
    });
  }
  document.addEventListener('click', onClick, {capture:true});
})();