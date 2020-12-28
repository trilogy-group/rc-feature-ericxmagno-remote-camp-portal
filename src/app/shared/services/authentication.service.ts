import { Injectable } from '@angular/core';
import { AuthenticationTokenService } from './authentication-token.service';
import { finalize, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, interval } from 'rxjs';


import { environment } from 'src/environments/environment';

@Injectable()
export class AuthenticationService {
  private LOGIN = `${environment.apiUrl}/AuthenticationGoogleToken`;
  private IMPERSONATE = `${environment.apiUrl}/Impersonation`;
  private REFRESH = `${environment.apiUrl}/RefreshJWToken`;
  public subscriber: Subscription;

  public constructor(
    public authenticationTokenService: AuthenticationTokenService,
    private httpClient: HttpClient
  ) {}

  public login(token: string): Observable<any> {
    return this.httpClient.post(this.LOGIN, JSON.stringify(token))
      .pipe(map(response => this.authenticationTokenService.saveToken(response.toString())),
      finalize( () => this.startJwtJob()));
  }

  public impersonate(email: string): Observable<any> {
    return this.httpClient.post(this.IMPERSONATE, JSON.stringify(email))
      .pipe(map(response => this.authenticationTokenService.saveToken(response.toString())));
  }

  public refreshToken(token: string): Observable<any> {
    return this.httpClient.post(this.REFRESH, JSON.stringify(token))
      .pipe(map(response => this.authenticationTokenService.saveToken(response.toString())));
  }

  public refreshJwt() {
    if (this.authenticationTokenService.getTokenExpiryStatus()) {
      const token = this.authenticationTokenService.getToken();
      this.refreshToken(token).subscribe(() => {});
    }
  }

  public startJwtJob() {
      // Refresh JWT every hour
      const refreshRate = interval(1000 * 60 * 60);
      this.subscriber = refreshRate.subscribe(
          () => this.refreshJwt()
      );
  }

  public stopJwtJob() {
      this.subscriber.unsubscribe();
  }
}
