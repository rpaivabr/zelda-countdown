import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-countdown',
  imports: [CommonModule],
  templateUrl: './countdown.html',
  styleUrl: './countdown.scss',
})
export class Countdown {
  // Target: New Year's of the next year
  targetDate = new Date(new Date().getFullYear() + 1, 0, 1).getTime(); 
  // targetDate = new Date('2025-12-30T21:43:00').getTime();
  
  // For testing, uncomment this to set target to 10 seconds from now:
  // targetDate = new Date().getTime() + 10000;

  // State to track if user has clicked "Start"
  hasStarted = signal(false);

  // Signals for time units
  days = signal(0);
  hours = signal(0);
  minutes = signal(0);
  seconds = signal(0);
  
  // Computed signal to check if time is up
  isNewYear = computed(() => {
    return this.days() <= 0 && this.hours() <= 0 && this.minutes() <= 0 && this.seconds() <= 0;
  });

  secEff = effect(() => {
    this.seconds();
    if (this.hasStarted()) {
      this.tickSound.currentTime = 0;
      this.tickSound.play().catch(e => console.warn("Tick blocked:", e));
    }
  })

  private timerSub!: Subscription;

  // --- AUDIO SETUP ---
  private tickSound = new Audio('./audio/rupee-tick.wav');
  private openChestSound = new Audio('./audio/chest-open.ogg');
  // We need a reference to the listener function to be able to remove it later
  private navigateOnSoundEnd = () => this.router.navigate(['/reward']);

  constructor(private router: Router) {
    // It's good practice to set volume to avoid being too loud
    this.tickSound.volume = 0.4;
    this.openChestSound.volume = 0.7;
  }

  ngOnInit() {
    // this.updateTime(); // Initial call
    // this.timerSub = interval(1000).subscribe(() => this.updateTime());
    this.calculateTime();
  }

  // === NEW: Triggered by the "Start" button ===
  initialize() {
    this.hasStarted.set(true);

    // 1. "Unlock" the audio engine immediately on this user click
    // We play and immediately pause/reset the chest sound just to "warm it up"
    this.openChestSound.load(); 
    
    // 2. Play the first tick immediately
    // this.tickSound.play().catch(e => console.error("Audio error:", e));

    // 3. Start the interval loop
    this.timerSub = interval(100).subscribe(() => {
      this.calculateTime();
    });
  }

  calculateTime() {
    const now = new Date().getTime();
    const distance = this.targetDate - now;

    if (distance < 0) {
      this.days.set(0); this.hours.set(0); this.minutes.set(0); this.seconds.set(0);
      this.timerSub?.unsubscribe();
    } else {
      this.days.set(Math.floor(distance / (1000 * 60 * 60 * 24)));
      this.hours.set(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      this.minutes.set(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      this.seconds.set(Math.floor((distance % (1000 * 60)) / 1000));
    }
  }

  openChest() {
    if (this.isNewYear()) {
      this.timerSub?.unsubscribe(); // Stop ticking when opening
      this.openChestSound.addEventListener('play', this.navigateOnSoundEnd);
      this.openChestSound.play();
    }
  }

  ngOnDestroy() {
    if (this.timerSub) this.timerSub.unsubscribe();
    this.openChestSound.removeEventListener('play', this.navigateOnSoundEnd);
  }
}
