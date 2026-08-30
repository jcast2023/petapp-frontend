import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Si la petición va a la autenticación pública, se envía normal
  if (req.url.includes('/api/auth/')) {
    return next(req);
  }

  // 2. Para todo lo demás (mascotas, vacunas, etc.), conserva las cookies HTTP-only
  const authReq = req.clone({
    withCredentials: true
  });

  return next(authReq);
};
