import './styles.css'
import wells from './data/wells.js?raw'
import events from './data/events.js?raw'
import app from './app.js?raw'

// The prototype uses inline handlers (onclick="go(3)") that need global bindings,
// so the data + app scripts run as one classic script after the markup is ready.
const s = document.createElement('script')
s.textContent = [wells, events, app].join('\n')
document.body.appendChild(s)
