import { Routes } from '@angular/router';
import { Countdown } from './countdown/countdown';
import { Reward } from './reward/reward';

export const routes: Routes = [
  { path: '', component: Countdown },
  { path: 'reward', component: Reward },
  { path: '**', redirectTo: '' }
];
