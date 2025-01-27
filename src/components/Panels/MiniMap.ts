import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";

export default (components: OBC.Components, world: OBC.World) => {
  const maps = components.get(OBC.MiniMaps);
  
  // Creamos el mapa directamente
  let map = maps.create(world);
  
  // Creamos un div contenedor para el minimapa
  const mapContainer = document.createElement('div');
  mapContainer.id = "minimap";
  mapContainer.style.cssText = `
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 200px;
    height: 200px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    overflow: hidden;
  `;

  // Agregamos el canvas del minimapa al contenedor
  const canvas = map.renderer.domElement;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.borderRadius = "12px";
  mapContainer.appendChild(canvas);

  // Creamos el componente BUI que contendrá el minimapa
  const miniMapComponent = BUI.Component.create(() => {
    return BUI.html`${mapContainer}`;
  });

  map.resize();

  return miniMapComponent;
};