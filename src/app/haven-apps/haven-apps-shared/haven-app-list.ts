import { HavenLeafletComponent } from '../haven-apps/haven-leaflet/haven-leaflet-component/haven-leaflet.component';
import { PlotlyLineComponent } from '../haven-apps/haven-plotly/haven-plotly-components/plotly-line/plotly-line.component'
import { PlotlyBarComponent } from '../haven-apps/haven-plotly/haven-plotly-components/plotly-bar/plotly-bar.component'
import { PlotlyHeatmapComponent } from '../haven-apps/haven-plotly/haven-plotly-components/plotly-heatmap/plotly-heatmap.component'
import { Plotly3dsurfaceComponent } from '../haven-apps/haven-plotly/haven-plotly-components/plotly-3dsurface/plotly-3dsurface.component'


export class HavenAppList {

  public static apps = {
    'leaflet': HavenLeafletComponent,
    'plotly-line': PlotlyLineComponent,
    'plotly-bar': PlotlyBarComponent,
    'plotly-heatmap': PlotlyHeatmapComponent,
    'plotly-3dsurface': Plotly3dsurfaceComponent,
  }
}
