import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './app/shared/interceptors/error.interceptor';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
bootstrapApplication(AppComponent, { providers: [provideRouter(routes), provideHttpClient(withInterceptors([errorInterceptor])), provideAnimations()] }).catch(console.error);
