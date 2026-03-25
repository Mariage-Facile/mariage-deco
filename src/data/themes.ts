import { Theme } from "@/lib/types";

export const themes: Theme[] = [
  {
    id: "champetre",
    name: "Champêtre",
    description:
      "Ambiance naturelle et bucolique avec des matières brutes : bois, jute, lin et fleurs des champs.",
    colors: ["#8B7355", "#A0C4A8", "#F5F0E8", "#D4A574"],
    image: "/themes/champetre.jpg",
  },
  {
    id: "boheme",
    name: "Bohème",
    description:
      "Esprit libre et poétique : macramé, plumes, herbes de la pampa et tons neutres.",
    colors: ["#C9B99A", "#E8D5B7", "#F7F3ED", "#A68B6B"],
    image: "/themes/boheme.jpg",
  },
  {
    id: "romantique",
    name: "Romantique",
    description:
      "Douceur et élégance avec des roses, des drapés et une palette rose poudré.",
    colors: ["#E8B4B8", "#F5D5D8", "#FFFFFF", "#C9929A"],
    image: "/themes/romantique.jpg",
  },
  {
    id: "moderne",
    name: "Moderne & Minimaliste",
    description:
      "Lignes épurées, géométrie et contraste noir/blanc rehaussé d'or.",
    colors: ["#2D2D2D", "#FFFFFF", "#D4AF37", "#F5F5F5"],
    image: "/themes/moderne.jpg",
  },
  {
    id: "provencal",
    name: "Provençal",
    description:
      "Soleil du sud : lavande, olivier, céramique et tons bleu-jaune.",
    colors: ["#7B68AE", "#F0C75E", "#EAE2D5", "#6B8E4E"],
    image: "/themes/provencal.jpg",
  },
  {
    id: "royal",
    name: "Royal & Glamour",
    description:
      "Luxe et faste : velours, cristal, dorures et couleurs profondes.",
    colors: ["#1B1464", "#D4AF37", "#8B0000", "#FFFFFF"],
    image: "/themes/royal.jpg",
  },
];
