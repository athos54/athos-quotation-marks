'use babel';

import AthosComillasView from './athos-comillas-view';
import { CompositeDisposable,Point,Range } from 'atom';

export default {

  athosComillasView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.athosComillasView = new AthosComillasView(state.athosComillasViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.athosComillasView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'athos-comillas:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.athosComillasView.destroy();
  },

  serialize() {
    return {
      athosComillasViewState: this.athosComillasView.serialize()
    };
  },

  toggle() {
    //el ciclo es '' > "" > espacios > ''
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let originalSelectedText = editor.getSelectedText()
      let selectedRange = editor.getSelectedScreenRange()
      let point1=new Point(selectedRange.start.row,selectedRange.start.column-1)
      let point2=new Point(selectedRange.end.row,selectedRange.end.column+1)
      let range = new Range(point1,point2)

      editor.setSelectedScreenRange(range)

      let txt = editor.getSelectedText()
      let primerCaracter=txt.substr(0,1)
      let stringSalida=''

      if(primerCaracter=="'"){
        //poner dobles comillas
        stringSalida='"'+originalSelectedText.substr(0,originalSelectedText.length)+'"'
        range=selectedRange
      }else if(primerCaracter=='"'){
        // poner espacios
        stringSalida=''+originalSelectedText.substr(0,originalSelectedText.length)+''
        let point1=new Point(selectedRange.start.row,selectedRange.start.column-1)
        let point2=new Point(selectedRange.end.row,selectedRange.end.column-1)
        range=new Range(point1,point2)
      }else if(primerCaracter==' '){
        // poner comillas simples
        stringSalida=' \''+originalSelectedText.substr(0,originalSelectedText.length)+'\' '
        let point1=new Point(selectedRange.start.row,selectedRange.start.column+1)
        let point2=new Point(selectedRange.end.row,selectedRange.end.column+1)
        range=new Range(point1,point2)
      }

      editor.insertText(stringSalida)
      editor.setSelectedScreenRange(range)
    }
  }

};
