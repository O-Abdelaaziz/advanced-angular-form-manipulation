import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _httpclient: HttpClient) {}

  public checkUsername(username: string) {
    console.log('username is : ' + username);
    return this._httpclient.get<any[]>(
      `https://jsonplaceholder.typicode.com/users?username=${username}`
    );
  }
}
