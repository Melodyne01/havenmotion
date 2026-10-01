import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Logotype horizontal : « HEAVEN » blanc pellicule + « MOTION » ambre. */
@Component({
  selector: 'app-logotype',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="logotype" [class.logotype--small]="small()">
      <span class="logotype__heaven">Heaven</span><span class="logotype__motion">Motion</span>
    </span>
  `,
  styles: [
    `
      @use 'tokens' as *;

      :host {
        display: inline-block;
      }

      .logotype {
        display: inline-flex;
        gap: 0.34em;
        font-family: $font-display;
        font-weight: $weight-bold;
        font-size: $fs-18;
        letter-spacing: $ls-14;
        line-height: $lh-flat;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .logotype--small {
        font-size: $fs-13;
      }

      .logotype__heaven {
        color: $color-film;
      }

      .logotype__motion {
        color: $color-amber;
      }
    `,
  ],
})
export class LogotypeComponent {
  readonly small = input(false);
}
