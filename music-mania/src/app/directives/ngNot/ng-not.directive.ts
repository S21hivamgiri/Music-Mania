import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({
  selector: '[ngNot]'
})
export class NgNotDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }

  @Input() set ngNot(condition: boolean|null|string) {

    /** Add the template content to the DOM unless the condition is true. */
    if (!condition && !this.hasView) {
      console.log(this.templateRef)
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    }
    else if (condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}