interface ICastTemplate {
  template: any;
  document: any;
}

export const castTemplate = ({ template, document }: ICastTemplate) => {
  return document;
};
