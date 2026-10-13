import {parseAmount,formatAmount} from './scale.js';
import {aggregateShopping} from './shopping.js';
import {cleanSelections,setSelectionCount,selectionKey,steppedCount} from './shopping-store.js';
import {renderPrintRecipes} from './shopping-print.js';

const LIST='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5h10v16H5V5h2M9 3h6v4H9zM9 11l1 1 2-2m2 1h2m-7 5 1 1 2-2m2 1h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export async function setupShopping(base) {
  const $=selector=>document.querySelector(selector);
  const recipes=await(await fetch(base+'assets/receptdata.json')).json();
  const lookup=new Map(recipes.map(r=>[r.slug,r]));
  const storageKey='receptboken-inkopslista:'+base;
  const dialog=$('#shopping-dialog');
  const standalone=document.body.dataset.page==='shopping';
  const params=new URLSearchParams(location.search);
  let selections=[],checked=new Set(),expand=true;
  try{selections=cleanSelections(JSON.parse(localStorage.getItem(storageKey)||'[]'),recipes);}catch{}
  try{const saved=JSON.parse(localStorage.getItem(storageKey+':avbockat')||'[]');if(Array.isArray(saved))checked=new Set(saved);expand=localStorage.getItem(storageKey+':delrecept')!=='nej';}catch{}
  if(standalone&&params.has('val')){
    try{selections=cleanSelections(JSON.parse(params.get('val')),recipes);}catch{selections=[];}
    expand=params.get('delrecept')!=='nej';checked.clear();
  }
  // Accept links from the previous version, then remove the one-time action.
  if(standalone&&lookup.has(params.get('laggTill'))){
    const added=cleanSelections([{slug:params.get('laggTill'),antal:params.get('antal')||1,variant:params.get('variant')}],recipes)[0];
    if(added){const old=selections.find(s=>selectionKey(s.slug,s.variant)===selectionKey(added.slug,added.variant));selections=setSelectionCount(selections,added.slug,added.variant,Math.min(1000000,(old?.antal||0)+added.antal));}
  }
  $('#expand-subrecipes').checked=expand;
  const copyAnnouncement=document.createElement('span');copyAnnouncement.className='sr-only';copyAnnouncement.setAttribute('role','status');copyAnnouncement.setAttribute('aria-live','polite');$('.list-footer').append(copyAnnouncement);
  try{$('#print-with-recipes').checked=localStorage.getItem(storageKey+':skrivut-recept')!=='nej';}catch{}
  const slots=[...document.querySelectorAll('.recipe-shopping-control')];
  const controllers=[];
  let result={items:[],warnings:[]};
  const rowKey=item=>item.namn.toLocaleLowerCase('sv')+'|'+item.enhet+'|'+item.källor.join('|');
  const current=(slug,variant)=>selections.find(s=>selectionKey(s.slug,s.variant)===selectionKey(slug,variant))?.antal||0;
  const shareUrl=()=>{const url=new URL(base+'inkopslista/',location.origin);url.searchParams.set('val',JSON.stringify(selections));if(!expand)url.searchParams.set('delrecept','nej');return url.href;};
  const save=()=>{
    try{localStorage.setItem(storageKey,JSON.stringify(selections));localStorage.setItem(storageKey+':avbockat',JSON.stringify([...checked]));localStorage.setItem(storageKey+':delrecept',expand?'ja':'nej');}catch{}
    if(standalone){const url=new URL(shareUrl());history.replaceState(null,'',url.pathname+url.search);}
  };
  const announce=message=>{$('#cart-announcement').textContent=message;};
  const setCount=(slug,variant,count,skip)=>{
    selections=setSelectionCount(selections,slug,variant,count);
    checked.clear();$('#shopping-status').textContent='';render(skip);save();
    announce(count>0?`${lookup.get(slug).titel.trim()}: ${String(count).replace('.',',')} ${lookup.get(slug).skalningsenhet} i inköpslistan.`:`${lookup.get(slug).titel.trim()} är borttagen ur inköpslistan.`);
  };
  const numberField=(recipe,variant,onChange)=>{
    const wrapper=document.createElement('div');wrapper.className='cart-stepper';
    const minus=document.createElement('button');minus.type='button';minus.textContent='−';minus.setAttribute('aria-label','Minska antal '+recipe.titel.trim());
    const input=document.createElement('input');input.type='text';input.inputMode='decimal';input.autocomplete='off';input.setAttribute('aria-label','Antal '+recipe.titel.trim()+' i inköpslistan');
    const plus=document.createElement('button');plus.type='button';plus.textContent='+';plus.setAttribute('aria-label','Öka antal '+recipe.titel.trim());
    const control={wrapper,input,minus,plus,slug:recipe.slug,variant,sync(){const count=current(recipe.slug,this.variant);if(document.activeElement!==input)input.value=String(count).replace('.',',');plus.disabled=count>=1000000;}};
    const commit=()=>{
      const raw=input.value.trim();const value=/^0(?:[.,]0+)?$/.test(raw)?0:parseAmount(raw);
      input.setAttribute('aria-invalid',String(value===null));
      control.pendingZero=value===0;
      if(value===null){$('#shopping-status').textContent='Ange ett antal mellan 0 och 1 000 000.';disableActions();return;}
      // Keep the field while typing "0,5". A finished zero removes the recipe on blur.
      if(value===0){disableActions();return;}
      onChange(value,control);updateActions();
    };
    input.addEventListener('input',commit);
    input.addEventListener('blur',()=>{if(control.pendingZero){control.pendingZero=false;onChange(0,control);}else if(input.getAttribute('aria-invalid')==='true'){input.setAttribute('aria-invalid','false');input.value=String(current(recipe.slug,control.variant)).replace('.',',');$('#shopping-status').textContent='';updateActions();}});
    minus.addEventListener('click',()=>onChange(steppedCount(current(recipe.slug,control.variant),-1),control));
    plus.addEventListener('click',()=>onChange(steppedCount(current(recipe.slug,control.variant),1),control));
    wrapper.append(minus,input,plus);control.sync();return control;
  };
  const disableActions=()=>{for(const id of ['shopping-print','shopping-copy','shopping-share','shopping-link'])$('#'+id).disabled=true;};
  const updateActions=()=>{const invalid=[...document.querySelectorAll('.cart-stepper:not([hidden]) input')].some(input=>parseAmount(input.value)===null);for(const id of ['shopping-print','shopping-copy','shopping-share','shopping-link'])$('#'+id).disabled=!selections.length||invalid;};
  for(const slot of slots){
    const recipe=lookup.get(slot.dataset.recipe);if(!recipe)continue;
    const choices=recipe.ingredienser.filter(g=>g.variant);
    let variant=slot.dataset.detail?($('#variant')?.value||choices[0]?.variant):choices[0]?.variant;
    slot.replaceChildren();
    const add=document.createElement('button');add.type='button';add.className='add-to-list';add.innerHTML=LIST;add.setAttribute('aria-label','Lägg till '+recipe.titel.trim()+' i inköpslistan');
    const stepper=numberField(recipe,variant,(value,c)=>{setCount(recipe.slug,c.variant,value,c);if(value===0)add.focus();});
    const unit=document.createElement('span');unit.className='cart-unit';unit.textContent=recipe.skalningsenhet;
    slot.append(add,stepper.wrapper,unit);
    let selector;
    if(choices.length&&!slot.dataset.detail){selector=document.createElement('select');selector.className='card-variant';selector.setAttribute('aria-label','Variant av '+recipe.titel.trim());for(const choice of choices){const option=document.createElement('option');option.value=choice.variant;option.textContent=choice.rubrik;selector.append(option);}slot.append(selector);selector.addEventListener('change',()=>{variant=selector.value;stepper.variant=variant;slotController.sync();});}
    const slotController={...stepper,sync(){if(slot.dataset.detail){variant=$('#variant')?.value||choices[0]?.variant;stepper.variant=variant;}const count=current(recipe.slug,variant);const active=count>0;add.hidden=active;stepper.wrapper.hidden=!active;unit.hidden=!active;if(selector)selector.hidden=!selections.some(s=>s.slug===recipe.slug);slot.classList.toggle('in-list',active);stepper.sync();}};
    controllers.push(slotController);
    add.addEventListener('click',()=>{const amount=slot.dataset.detail?(parseAmount($('#amount')?.value||'')||1):1;setCount(recipe.slug,variant,amount);stepper.plus.focus({preventScroll:true});});
    if(slot.dataset.detail)document.addEventListener('recipe-scaling-change',()=>slotController.sync());
  }
  const renderSelected=(skip)=>{
    const container=$('#shopping-selected');
    // Keep an actively edited field so typing does not lose focus or its caret.
    const oldKeys=[...container.children].map(row=>row.dataset.key).join('\n');
    const newKeys=selections.map(s=>selectionKey(s.slug,s.variant)).join('\n');
    if(oldKeys===newKeys){for(const control of selectedControls)if(control!==skip)control.sync();for(const [index,row] of [...container.children].entries()){const s=selections[index];row.querySelector('a').href=base+'recept/'+s.slug+'/?antal='+s.antal+(s.variant?'&variant='+s.variant:'');}return;}
    container.replaceChildren();selectedControls=[];
    for(const selection of selections){
      const recipe=lookup.get(selection.slug);const row=document.createElement('li');row.dataset.key=selectionKey(selection.slug,selection.variant);
      const titleWrap=document.createElement('div');titleWrap.className='selected-title';const title=document.createElement('a');title.href=base+'recept/'+recipe.slug+'/?antal='+selection.antal+(selection.variant?'&variant='+selection.variant:'');title.textContent=recipe.titel;titleWrap.append(title);
      const variant=recipe.ingredienser.find(g=>g.variant&&g.variant===selection.variant);if(variant){const description=document.createElement('small');description.textContent=variant.rubrik;titleWrap.append(description);}
      const control=numberField(recipe,selection.variant,(value,c)=>{setCount(recipe.slug,c.variant,value,c);if(value===0)$(dialog?'#list-close':'#list-title').focus();});selectedControls.push(control);
      const unit=document.createElement('span');unit.className='cart-unit';unit.textContent=recipe.skalningsenhet;
      const remove=document.createElement('button');remove.type='button';remove.className='remove-selection';remove.textContent='Ta bort';remove.setAttribute('aria-label','Ta bort '+recipe.titel.trim());remove.addEventListener('click',()=>{setCount(recipe.slug,selection.variant,0);$(dialog?'#list-close':'#list-title').focus();});
      row.append(titleWrap,control.wrapper,unit,remove);container.append(row);
    }
  };
  let selectedControls=[];
  const render=(skip)=>{
    controllers.forEach(c=>c.sync());renderSelected(skip);
    $('#shopping-empty-plan').hidden=selections.length>0;
    $('#shopping-clear').hidden=!selections.length;
    result=aggregateShopping(recipes,selections,expand);
    const list=$('#shopping-items');list.replaceChildren();
    for(const item of result.items){
      const row=document.createElement('li');const label=document.createElement('label');const check=document.createElement('input');check.type='checkbox';check.checked=checked.has(rowKey(item));row.classList.toggle('bought',check.checked);
      check.addEventListener('change',()=>{if(check.checked)checked.add(rowKey(item));else checked.delete(rowKey(item));row.classList.toggle('bought',check.checked);save();});
      const description=document.createElement('span');const name=document.createElement('span');name.className='shopping-item-name';name.textContent=item.namn;const sources=document.createElement('small');sources.textContent=item.källor.join(' · ');description.append(name,sources);
      const amount=document.createElement('span');amount.className='amount';amount.textContent=formatAmount(item.mängd,item.enhet);label.append(check,description,amount);row.append(label);list.append(row);
    }
    const warnings=$('#shopping-warnings');warnings.replaceChildren();warnings.hidden=!result.warnings.length;
    if(result.warnings.length){const title=document.createElement('h3');title.textContent='Kontrollera dessa uppgifter';warnings.append(title);for(const warning of result.warnings){const p=document.createElement('p');p.textContent=warning;warnings.append(p);}}
    $('#shopping-summary').textContent=selections.length?`${result.items.length} varor för ${selections.length} valda recept`:'Lägg till recept för att börja.';
    $('#shopping-footnote').hidden=!selections.length;
    renderPrintRecipes($('#shopping-print-recipes'),recipes,selections);
    const launcher=$('#shopping-launcher');if(launcher){launcher.hidden=!selections.length;$('#shopping-badge').textContent=selections.length;launcher.setAttribute('aria-label',`Öppna inköpslistan med ${selections.length} valda recept`);document.body.classList.toggle('has-shopping-list',selections.length>0);}
    updateActions();
  };
  let returnFocus;
  const openList=event=>{if(!dialog)return;if(event)event.preventDefault();if(!dialog.open){returnFocus=document.activeElement;render();dialog.showModal();document.body.classList.add('list-is-open');}};
  $('#shopping-launcher')?.addEventListener('click',openList);
  document.querySelectorAll('[data-open-shopping]').forEach(link=>link.addEventListener('click',openList));
  $('#list-close').hidden=!dialog;
  $('#list-close').addEventListener('click',()=>dialog?.close());
  dialog?.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
  dialog?.addEventListener('close',()=>{document.body.classList.remove('list-is-open');const fallback=$('[data-open-shopping]');if(returnFocus?.isConnected&&!returnFocus.hidden)returnFocus.focus();else fallback?.focus();});
  $('#expand-subrecipes').addEventListener('change',()=>{expand=$('#expand-subrecipes').checked;checked.clear();render();save();});
  $('#shopping-clear').addEventListener('click',()=>{selections=[];checked.clear();render();save();announce('Inköpslistan är tömd.');if(dialog)dialog.close();});
  const text=()=>['Inköpslista','',...selections.map(s=>{const r=lookup.get(s.slug);const variant=r.ingredienser.find(g=>g.variant&&g.variant===s.variant);return `${String(s.antal).replace('.',',')} ${r.skalningsenhet} ${r.titel.trim()}${variant?' ('+variant.rubrik+')':''}`;}),'',...result.items.map(i=>`${i.namn}: ${formatAmount(i.mängd,i.enhet)}`),...result.warnings.map(w=>'OBS: '+w)].join('\n');
  const feedbackTimers=new Map();
  const copyFeedback=(button,success)=>{
    const icon=button.querySelector('.action-icon');if(!icon.dataset.original)icon.dataset.original=icon.innerHTML;
    clearTimeout(feedbackTimers.get(button));
    icon.innerHTML=success?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>':icon.dataset.original;
    button.classList.toggle('copy-success',success);button.classList.toggle('copy-error',!success);
    copyAnnouncement.textContent=success?'Kopierat.':'Det gick inte att kopiera. Försök igen.';
    feedbackTimers.set(button,setTimeout(()=>{icon.innerHTML=icon.dataset.original;button.classList.remove('copy-success','copy-error');},2200));
  };
  const copy=async(value,button)=>{try{if(navigator.clipboard&&isSecureContext)await navigator.clipboard.writeText(value);else{const area=document.createElement('textarea');area.value=value;area.style.cssText='position:fixed;opacity:0;left:0;top:0';(dialog?.open?dialog:document.body).append(area);area.select();const ok=document.execCommand('copy');area.remove();if(!ok)throw Error('copy');}$('#shopping-status').textContent='';copyFeedback(button,true);}catch{copyFeedback(button,false);}};
  $('#shopping-copy').addEventListener('click',event=>copy(text(),event.currentTarget));$('#shopping-link').addEventListener('click',event=>copy(shareUrl(),event.currentTarget));
  $('#shopping-share').addEventListener('click',async event=>{const button=event.currentTarget;if(navigator.share){try{await navigator.share({title:'Inköpslista · Receptboken',url:shareUrl()});}catch(error){if(error.name!=='AbortError')await copy(shareUrl(),button);}}else await copy(shareUrl(),button);});
  $('#print-with-recipes').addEventListener('change',()=>{try{localStorage.setItem(storageKey+':skrivut-recept',$('#print-with-recipes').checked?'ja':'nej');}catch{}});
  const beforePrint=()=>{document.body.classList.toggle('print-shopping-dialog',!!dialog?.open);document.body.classList.toggle('include-recipe-print',(!!dialog?.open||standalone)&&$('#print-with-recipes').checked);};
  $('#shopping-print').addEventListener('click',()=>{beforePrint();window.print();});window.addEventListener('beforeprint',beforePrint);window.addEventListener('afterprint',()=>document.body.classList.remove('print-shopping-dialog','include-recipe-print'));
  window.addEventListener('storage',event=>{if(event.key===storageKey){try{selections=cleanSelections(JSON.parse(event.newValue||'[]'),recipes);}catch{selections=[];}checked.clear();render();}});
  render();save();
}
