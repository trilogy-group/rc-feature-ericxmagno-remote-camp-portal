import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AccomplishmentsService {
  private GET_PROFILE = `${environment.apiUrl}/profile`;
  private GET_HARDEST_PROBLEMS = `${environment.apiUrl}/ProfileHardestProblems`;
  private GET_PROFILE_ACCOMPLISHMENTS = `${environment.apiUrl}/ProfileAccomplishments`;

  public constructor(
    private http: HttpClient
  ) {}

  public getAcomplishmentsDailyProgress(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(this.GET_PROFILE_ACCOMPLISHMENTS, { headers });
  }

  public getHardestProblems(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(this.GET_HARDEST_PROBLEMS, { headers });
  }

  public getProfile(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(this.GET_PROFILE, { headers });
  }

  private createAuthorizationHeader(): HttpHeaders {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`,
      'content-type': 'application/json',
    });
    return headers;
  }
}
