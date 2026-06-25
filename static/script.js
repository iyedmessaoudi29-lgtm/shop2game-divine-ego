document.addEventListener('DOMContentLoaded', ()=>{
  const welcomeScreen = document.getElementById('welcomeScreen');
  const enterBtn = document.getElementById('enterBtn');
  const appShell = document.getElementById('appShell');
  const buyBtn = document.getElementById('buyBtn');
  const userIdEl = document.getElementById('userId');
  const promoCodeEl = document.getElementById('promoCode');
  const packEl = document.getElementById('pack');
  const msg = document.getElementById('message');

  function show(text, isError){
    msg.textContent = text;
    msg.style.color = isError ? '#ffccd5' : '#d1fae5';
  }

  enterBtn.addEventListener('click', ()=>{
    welcomeScreen.classList.add('hidden');
    appShell.classList.remove('hidden');
  });

  userIdEl.addEventListener('input', ()=>{
    userIdEl.value = userIdEl.value.replace(/\D/g, '').slice(0, 8);
  });

  buyBtn.addEventListener('click', async ()=>{
    const user_id = userIdEl.value.trim();
    const pack_id = packEl.value;
    const promo_code = promoCodeEl.value.trim().toUpperCase();

    if(user_id.length !== 8){
      show('ادخل UID صالح مكون من 8 أرقام.', true);
      userIdEl.focus();
      return;
    }

    buyBtn.disabled = true; show('جاري إرسال الطلب...');

    try{
      const res = await fetch('/purchase', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({user_id, pack_id, promo_code})
      });

      const data = await res.json();
      if(!res.ok){
        show(data.error || 'حدث خطأ', true);
      } else {
        const order = data.order;
        const priceText = order.free_offer ? 'مجانا' : `${order.price.toFixed(2)}$`;
        show(`نجاح! أمر الشحن: ${order.order_id} — ${order.gems} جواهر (${priceText})`);
      }
    }catch(err){
      show('فشل الاتصال بالخادم.', true);
    } finally { buyBtn.disabled = false }
  });
});
