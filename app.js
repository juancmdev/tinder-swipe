const DECISION_THERESHOLD = 75;
let isAnimating = false;
let pullDeltaX = 0; //Distancia que la card se está arrastrando,Delta es la diferencia entre 2 posiciones

function startDrag(e) {
  if (isAnimating) return;

  //Recuperamos el primer elemento de las cards
  const actualCard = e.target.closest("article");
  if (!actualCard) return;

  //Conseguir la posición inicial del mouse o el dedo
  //console.log(e);
  const startX = e.pageX ?? e.touches[0].pageX; //El touches[0] es para el primer toque con el dedo
  //console.log(startX);

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

    //Resetear la flag para indicar que estamos animando
    isAnimating = true;

    //Cálculo de la rotación de la card usando la distancia
    const deg = pullDeltaX / 14;

    //Aplicar la transformación a la card
    actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;
    //Cambiar el cursor a grabbing
    actualCard.style.cursor = "grabbing";

    //Cambiar la opacidad de choice info
    const opacity = Math.abs(pullDeltaX) / 100;
    const isRight = pullDeltaX > 0;

    const choiceEl = isRight
      ? actualCard.querySelector(".choice.like")
      : actualCard.querySelector(".choice.nope");

    choiceEl.style.opacity = opacity;
  }

  function onEnd(e) {
    //remover los event listeners
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onEnd);

    document.removeEventListener("touchmove", onMove);
    document.removeEventListener("touchend", onEnd);

    //Saber si el usuario tomó una desición
    const decisionMade = Math.abs(pullDeltaX) >= DECISION_THERESHOLD;
    console.log(pullDeltaX);

    if (decisionMade) {
      //console.log("Desición hecha");
      const goRight = pullDeltaX >= 0;
      //const goLeft = !goRight;

      //Adicional la clase de acuerdo a la desición
      actualCard.classList.add(goRight ? "go-right" : "go-left");
      actualCard.addEventListener(
        "transitioned",
        () => {
          actualCard.remove();
        },
        { once: true } //Modificador de suscribir al evento una vez ejemplo, al click una sola vez
      );
    } else {
      //console.log("Pensando");
      actualCard.classList.add("reset");
      actualCard.classList.remove("go-right", "go-left");
      actualCard.querySelectorAll("choice").forEach((el) => {
        el.style.opacity = 0;
      });
    }

    //Resetear las variables
    actualCard.addEventListener("transitionend", () => {
      actualCard.removeAttribute("style");
      actualCard.classList.remove("reset");

      pullDeltaX = 0;
      isAnimating = false;
    });
  }
}

document.addEventListener("mousedown", startDrag);
document.addEventListener("touchstart", startDrag), { passive: true }; //al utilizar el pasive: true es ignorar el comportamiento por defecto y ponerlo en segundo plano
