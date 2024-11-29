/* eslint-disable no-alert */
import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import * as CUI from "@thatopen/ui-obc";


export default (components: OBC.Components) => {
  const [loadBtn] = CUI.buttons.loadIfc({ components });
  loadBtn.label = "IFC";
  loadBtn.tooltipTitle = "Cargar IFC";
  loadBtn.tooltipText =
    "Carga un archivo IFC en la escena.";



  return BUI.Component.create<BUI.PanelSection>(() => {
    return BUI.html`
      <bim-toolbar-section label="Importar" icon="solar:import-bold">
        ${loadBtn}
      </bim-toolbar-section>
    `;
  });
};
