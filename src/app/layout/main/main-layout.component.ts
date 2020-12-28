import { AuthenticationService } from './../../shared/services/authentication.service';
import { Component, ViewChild } from '@angular/core';

import { AuthenticationTokenService } from 'src/app/shared/services/authentication-token.service';
import { DfSidebar } from '@devfactory/ngx-df/sidebar';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  @ViewChild('sideBar')
  private sideBar: DfSidebar;

  public constructor(
    private _authenticationTokenService: AuthenticationTokenService,
    private _authenticationService: AuthenticationService
  ) {}

  public logout(): void {
    this._authenticationTokenService.logout();
    this._authenticationService.stopJwtJob();
  }

  public toggleSideBar(): void {
    this.sideBar.toogleOpen();
  }

  public isAdmin(): boolean {
    return this._authenticationTokenService.isUserAdmin();
  }

  public icHasStarted(): boolean {
    return this._authenticationTokenService.hasICStarted();
  }
}
