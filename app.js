let isAnimating = false;
let pullDeltaX = 0; //Distancia que la card se está arrastrando,Delta es la diferencia entre 2 posiciones

function starDrag(e) {
  if (isAnimating) return;

  //Recuperamos el primer elemento de las cards
  const actualCard = e.target.closest("article");

  //Conseguir la posición inicial del mouse o el dedo
  //console.log(e);
  const startX = e.pageX ?? e.touches[0].pageX; //El touches[0] es para el primer toque con el dedo
  console.log(startX);

  //Escuchar los movimientos del mouse y del touch
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onEnd);

  document.addEventListener("touchmove", onMove), { passive: true }; //al utilizar el pasive: true es ignorar el comportamiento por defecto y ponerlo en segundo plano
  document.addEventListener("touchend", onEnd), { passive: true }; //al utilizar el pasive: true es ignorar el comportamiento por defecto y ponerlo en segundo plano

  function onMove(e) {
    //Current position
    const currentX = e.pageX ?? e.touches[0].pageX;

    //Distancia entre la posición inicial y el current
    pullDeltaX = currentX - startX;
    //console.log(pullDeltaX);

    if (pullDeltaX === 0) return;

    //Cambiar la flag para indicar que estamos animando
    isAnimating = true;

    //Cálculo de la rotación de la card usando la distancia
    const deg = pullDeltaX / 10;

    //Aplicar la transformación a la card
    actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;
    //Cambiar el cursor a grabbing
    actualCard.style.cursor = "grabbing";
  }
}

function onEnd(e) {}

document.addEventListener("mousedown", starDrag);
document.addEventListener("touchstart", starDrag), { passive: true }; //al utilizar el pasive: true es ignorar el comportamiento por defecto y ponerlo en segundo plano
