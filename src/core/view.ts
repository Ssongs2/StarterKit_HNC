
export default abstract class View {
    private template: string;
    private renderTemplate: string;
    private container: HTMLElement;
    private htmlList: string[];
  
    constructor(containerId: string, template: string) {
      const containerElement = document.getElementById(containerId);
      if (!containerElement) {
        throw '최상위 컨테이너가 없어 UI를 진행하지 못합니다.'
      }
  
      this.container = containerElement;
      this.template = template;
      this.renderTemplate = template;
      this.htmlList = [];
    }
  
    protected updateView(): void {
      // 배열에 있는 요소를 문자열로 합쳐줌.
      this.container.innerHTML = this.renderTemplate;
      this.renderTemplate = this.template;
    }

    protected addhtml(htmlString: string): void {
      this.htmlList.push(htmlString);
    }

    protected gethtml(): string {
      const snapshot = this.htmlList.join('');
      this.clearHtmlList();
      return snapshot;
    }

    protected setTemplateData(key: string, value: string): void {
      this.renderTemplate = this.renderTemplate.replace(`{{__${key}__}}`, value);
    }

    protected clearHtmlList(): void {
      this.htmlList = [];
    }
    
    abstract render(...params: string[]): void; // 추상메소드 // 상속된 클래스에 한해 접근가능
  }
  