
// 获取DOM元素的大小及相对视口位置
export function getTargetRect(target:any){
  return target !== window 
    ? target.getBoundingClientRect()
    : { top: 0, bottom: window.innerHeight}
}

// 获取固定Top
export function getFixedTop(placeholderRect:any, targetRect:any, offsetTop:any){
  if(offsetTop !== undefined && targetRect.top > placeholderRect.top - offsetTop){
    return offsetTop + targetRect.top + 'px'
  }
  return undefined
}

// 获取固定bottom
export function getFixedBottom(placeholderRect:any, targetRect:any, offsetBottom:any){
  if(offsetBottom !== undefined && targetRect.bottom < placeholderRect.bottom + offsetBottom){
    const targetBottomOffset = window.innerHeight - targetRect.bottom
    return offsetBottom + targetBottomOffset + 'px'
  }
  return undefined
}

// ========================= Observer =========================
const TRIGGER_EVENTS = [
  'resize',
  'scroll',
  'pageshow',
  'load'
]
let observerEntities:any = []

function eventHandler(entity:any){
  entity.affixList.forEach((targetAffix:any) => {
    targetAffix.lazyUpdatePosition()
  })
}

export function addObserveTarget(target:any, affix:any){
  if(!target) return;

  let entity = observerEntities.find((item:any) => item.target === target)
  if(entity){
    entity.affixList.push(affix)
  } else {
    entity = {
      target,
      affixList: [affix]
    }
    observerEntities.push(entity)

    // add listener
    TRIGGER_EVENTS.forEach(eventName => {
      // entity.target.addEventListener(eventName, eventHandler(entity))
      entity.target.addEventListener(eventName, () => {
        entity.affixList.forEach((targetAffix:any) => {
          targetAffix.lazyUpdatePosition()
        })
      })
    })
  }
}

export function removeObserveTarget(affix:any){
  const observerEntity = observerEntities.find((oriObserverEntity:any) => {
    const hasAffix = oriObserverEntity.affixList.some((item:any) => item === affix)
    if(hasAffix){
      oriObserverEntity.affixList = oriObserverEntity.affixList.filter((item:any) => item != affix)
    }
    return hasAffix
  })

  if(observerEntity && observerEntity.affixList.length === 0){
    observerEntities = observerEntities.filter((item:any) => item !== observerEntity)

    // remove listener
    TRIGGER_EVENTS.forEach(eventName => {
      observerEntity.target.removeEventListener(eventName, eventHandler(observerEntity))
    })
  }
}