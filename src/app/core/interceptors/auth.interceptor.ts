import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Con cookies HTTP-only, solo necesitamos withCredentials: true
  // El navegador envía automáticamente las cookies
  const authReq = req.clone({
    withCredentials: true
  });

  return next(authReq);
};
