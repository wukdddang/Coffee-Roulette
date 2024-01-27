export enum pastelColors {
  "#FFB6C1" = "LightPink", // 분홍색 (LightPink)
  "#00CED1" = "DarkTurquoise", // 청록색 (DarkTurquoise)
  "#FFD700" = "Gold", // 살구색 (Gold)
  "#98FB98" = "PaleGreen", // 연한 민트색 (PaleGreen)
  "#DDA0DD" = "Lavender", // 연한 라벤더색 (Lavender)
  "#20B2AA" = "LightSeaGreen", // 연한 터콰이즈색 (LightSeaGreen)
  "#FFFACD" = "LemonChiffon", // 연한 노란색 (LemonChiffon)
  "#87CEEB" = "SkyBlue", // 연한 파란색 (SkyBlue)
  "#FFA07A" = "LightSalmon", // 연한 오렌지색 (LightSalmon)
  "#ADFF2F" = "GreenYellow", // 연한 연두색 (GreenYellow)
  "#8FBC8F" = "DarkSeaGreen", // 연한 라임색 (DarkSeaGreen)
  "#9370DB" = "MediumPurple", // 연한 퍼플색 (MediumPurple)
  "#00FA9A" = "MediumSpringGreen", // 연한 푸른색 (MediumSpringGreen)
  "#FF6347" = "Tomato", // 연한 코랄색 (Tomato)
  "#FFDAB9" = "PeachPuff", // 연한 샤베트색 (PeachPuff)
  "#FFE4C4" = "Bisque", // 연한 베이지색 (Bisque)
}

export function getPastelColors(): string[] {
  return Object.keys(pastelColors);
}
