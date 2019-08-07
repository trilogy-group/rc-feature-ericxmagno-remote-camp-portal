import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

@Injectable()
export class RegistrationService {
  private rolesMock = [{
    id: 1,
    name: 'Java Software Architect'
  },
  {
    id: 2,
    name: 'Java Software Engineer'
  }];

  private rolePrerequisitesMock = [
    {
      id: 1,
      name: 'Virtualization'
    },
    {
      id: 2,
      name: 'Cloud (AWS)'
    }
  ];

  public getAvailableRoles(): Observable<any> {
    return of(this.rolesMock);
  }

  public getRolePrerequisites(roleId: number): Observable<any> {
    return of(this.rolePrerequisitesMock);
  }

  public submit(signupData: any): Observable<any> {
    return of('');
  }
}
