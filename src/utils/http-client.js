import { httpHeaders } from "../environments/environment.prod";

export class HttpClient {

    async get(url){
        let response = await fetch(url, {method: 'GET', headers: httpHeaders});
        let result = await response.json();
        return result;
    }
}