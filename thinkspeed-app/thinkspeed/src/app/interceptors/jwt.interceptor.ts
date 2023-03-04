import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { LoginService } from 'src/login.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  organization: any;
  constructor(private loginService: LoginService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let orgnization: any;
    this.loginService.token$.pipe(take(1)).subscribe((token) => {
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,


          },
        });
      }
    });

    return next.handle(request);
  }
}
