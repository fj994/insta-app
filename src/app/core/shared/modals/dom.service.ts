import {
  Injectable,
  Injector,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  ApplicationRef,
  ComponentRef
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DomService {
  private childComponentRef: ComponentRef<any>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  public appendComponent(child: any, childConfig?: childConfig) {
    const childComponentRef = this.componentFactoryResolver
      .resolveComponentFactory(child)
      .create(this.injector);

    this.attachConfig(childConfig, childComponentRef);

    this.childComponentRef = childComponentRef;

    this.appRef.attachView(childComponentRef.hostView);

    const childDomElem = (childComponentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    document.getElementsByTagName('body')[0].appendChild(childDomElem);
  }

  public removeComponent() {
    this.appRef.detachView(this.childComponentRef.hostView);
    this.childComponentRef.destroy();
  }

  private attachConfig(config, ComponentRef) {
    let inputs = config.inputs;
    let outputs = config.outputs;

    for(const key in inputs) {
      ComponentRef.instance['inputs'] = inputs;
      ComponentRef.instance['outputs'] = outputs;
    }
  }
}

interface childConfig {
  inputs: object;
  outputs: object;
}