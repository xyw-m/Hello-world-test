
// 获取DOM元素的大小及相对视口位置
export function getTargetRect(target:any){
  return target !== window 
    ? target.getBoundingClientRect()
    : { top: 0, bottom: window.innerHeight}
}

// 获取固定Top
export function getFixedTop(placeholderRect, targetRect, offsetTop){
  if(offsetTop !== undefined && targetRect.top > placeholderRect.top - offsetTop){
    return offsetTop + targetRect.top + 'px'
  }
  return undefined
}

// 获取固定bottom
export function getFixedBottom(placeholderRect, targetRect, offsetBottom){
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
let observerEntities = []

function eventHandler(entity:any){
  entity.affixList.forEach(targetAffix => {
    targetAffix.lazyUpdatePosition()
  })
}

export function addObserveTarget(target, affix){
  if(!target) return;

  let entity = observerEntities.find(item => item.target === target)
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
        entity.affixList.forEach(targetAffix => {
          targetAffix.lazyUpdatePosition()
        })
      })
    })
  }
}

export function removeObserveTarget(affix){
  const observerEntity = observerEntities.find(oriObserverEntity => {
    const hasAffix = oriObserverEntity.affixList.some(item => item === affix)
    if(hasAffix){
      oriObserverEntity.affixList = oriObserverEntity.affixList.filter(item => item != affix)
    }
    return hasAffix
  })

  if(observerEntity && observerEntity.affixList.length === 0){
    observerEntities = observerEntities.filter(item => item !== observerEntity)

    // remove listener
    TRIGGER_EVENTS.forEach(eventName => {
      observerEntity.target.removeEventListener(eventName, eventHandler(observerEntity))
    })
  }
}