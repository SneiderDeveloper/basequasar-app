import { email, password } from '../../env'
import env from 'src/environments/environment.dev'

export const config = {
    url: `http://localhost:8080/#`,
    // url: 'https://agreeable-meadow-08dd7350f.2.azurestaticapps.net/#',
    // url: 'https://brave-forest-074656b0f.2.azurestaticapps.net/#',
    apiBase: env.baseUrl,
    credentials: {
        email,
        password,
    }
}