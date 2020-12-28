import { AuthenticationTokenService } from './authentication-token.service';
import { AuthenticationService } from './authentication.service';
import { HttpClient } from '@angular/common/http';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DfHttpSkipInterceptorEnum } from '@devfactory/ngx-df/interceptor';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable, Subscription, interval, of } from 'rxjs';

import { environment } from 'src/environments/environment';

describe('AuthenticationService Tests', () => {
    let mockTokenAuthenticationService: AuthenticationTokenService;
    let service: AuthenticationService;
    let httpTestingController: HttpTestingController;
    let httpClient: HttpClient;
    const LOGIN = `${environment.apiUrl}/AuthenticationGoogleToken`;
    const IMPERSONATE = `${environment.apiUrl}/Impersonation`;
    const REFRESH = `${environment.apiUrl}/RefreshJWToken`;
    const options = { headers: {} };
    options['headers'][DfHttpSkipInterceptorEnum.LoaderInterceptor] = '';

    beforeEach(() => {
        jasmine.getEnv().allowRespy(true);
        TestBed.configureTestingModule({
            providers: [AuthenticationService,
            { provide: AuthenticationTokenService, useValue: mockTokenAuthenticationService}],
            imports: [HttpClientTestingModule]
        });
        httpClient = TestBed.get(HttpClient);
        mockTokenAuthenticationService = jasmine.createSpyObj('AuthenticationTokenService', ['saveToken', 'getToken',
        'getTokenExpiryStatus']);
        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(AuthenticationService);
    });

    afterEach(() => {
    });

    it('should be created', () => {
        // Assert
        expect(service).toBeTruthy();
    });

    describe('login', () => {
        it('should call httpClient.post using correct Url', () => {
            // Arrange
            const expectedUrl = LOGIN;
            const tokenString = 'token';

            // Act
            service.login(tokenString).subscribe( (response) => {
                expect(httpClient.post).toHaveBeenCalledWith(expectedUrl, JSON.stringify(tokenString));
                expect(mockTokenAuthenticationService.saveToken).toHaveBeenCalledWith(response.toString());
                expect(service.startJwtJob).toHaveBeenCalled();
            });

            // // have a handle on the HTTP call that is about to take flight
            const req = httpTestingController.expectOne(expectedUrl);
            expect(req.request.method).toEqual('POST');

            httpTestingController.verify();
        });
    });

    describe('refreshToken', () => {
        it('should call httpClient.post using correct Url', () => {
            // Arrange
            const expectedUrl = REFRESH;
            const tokenString = 'token';

            // Act
            service.refreshToken(tokenString).subscribe( response => {
                expect(httpClient.post).toHaveBeenCalledWith(expectedUrl, JSON.stringify(tokenString));
                expect(mockTokenAuthenticationService.saveToken).toHaveBeenCalledWith(response.toString());
            });

            const req = httpTestingController.expectOne(expectedUrl);
            expect(req.request.method).toEqual('POST');

            httpTestingController.verify();
        });
    });

    describe('startJwtJob', () => {
        it('should call refreshJwt after 1 hour', fakeAsync(() => {
            // Arrange
            spyOn(service, 'refreshJwt');
            const refreshRate = interval(1000 * 60 * 60);

            // Act
            service.startJwtJob();
            tick(1000 * 60 * 60);

            // Assert
            expect(service.refreshJwt).toHaveBeenCalledTimes(1);

            service['subscriber'].unsubscribe();
        }));
    });

    describe('stopJwtJob', () => {
        it('should stop subscriber on call', () => {
            // Arrange
            service['subscriber'] = of(true).subscribe();

            // Act
            service.stopJwtJob();

            // Assert
            expect(service['subscriber'].closed).toBeTruthy();
        });
    });

    describe('refreshJwt', () => {
        it('should run refreshToken if getTokenExpiryStatus returns True', () => {
            // Arrange
            spyOn(service, 'refreshToken').and.returnValue(of(() => {}));
            spyOn(service.authenticationTokenService, 'getTokenExpiryStatus').and.callFake(function() {
                return true;
                 });

            // // Act
            service.refreshJwt();

            // Assert
            expect(service.refreshToken).toHaveBeenCalled();
        });
    });
});
