/* AOS Core Styles */
[data-aos] {
  opacity: 0;
  transition-property: opacity, transform;
  transition-duration: 0.6s;
  transition-timing-function: ease;
}

[data-aos].aos-animate {
  opacity: 1;
}

/* Fade Up */
[data-aos="fade-up"] {
  transform: translateY(20px);
}
[data-aos="fade-up"].aos-animate {
  transform: translateY(0);
}

/* Fade Down */
[data-aos="fade-down"] {
  transform: translateY(-20px);
}
[data-aos="fade-down"].aos-animate {
  transform: translateY(0);
}

/* Fade Left */
[data-aos="fade-left"] {
  transform: translateX(-20px);
}
[data-aos="fade-left"].aos-animate {
  transform: translateX(0);
}

/* Fade Right */
[data-aos="fade-right"] {
  transform: translateX(20px);
}
[data-aos="fade-right"].aos-animate {
  transform: translateX(0);
}

/* Zoom In */
[data-aos="zoom-in"] {
  transform: scale(0.8);
}
[data-aos="zoom-in"].aos-animate {
  transform: scale(1);
}

/* Zoom Out */
[data-aos="zoom-out"] {
  transform: scale(1.2);
}
[data-aos="zoom-out"].aos-animate {
  transform: scale(1);
}

/* Flip Left */
[data-aos="flip-left"] {
  transform: rotateY(90deg);
}
[data-aos="flip-left"].aos-animate {
  transform: rotateY(0deg);
}

/* Flip Right */
[data-aos="flip-right"] {
  transform: rotateY(-90deg);
}
[data-aos="flip-right"].aos-animate {
  transform: rotateY(0deg);
}
