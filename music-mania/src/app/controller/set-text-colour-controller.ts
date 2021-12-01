export function setTextColorOnHeader(e: any) {
  const textColor = e.getCurrentSong()?.textColor;
  const textCss = `.mat-accent .mat-slider-track-fill, .mat-accent .mat-slider-thumb, .mat-accent .mat-slider-thumb-label {
                      background: ${textColor}!important;
                    }
                    .mat-form-field.mat-focused .mat-form-field-ripple {
                      background: ${textColor}!important;
                    }
                    .mat-chip.mat-standard-chip {
                      background: ${textColor}!important;
                    }
                    .mat-form-field-label{
                      color: ${textColor}!important;
                    }
                    `
  let sliderClass = document.getElementsByTagName('style')[0];
  if (!(sliderClass.classList.contains('audio-tag'))) {
    sliderClass.classList.add('audio-tag');
    sliderClass.append(textCss);
  } else {
    sliderClass.innerText = sliderClass.innerText.replace(sliderClass.innerText, textCss);
  }
}