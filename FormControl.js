export class FormControl {
    constructor( obj ) {
      this.id = obj.id;
      this.type = obj.type;
      this.title = obj.title;
      this.options = obj.options;
      this.value = '';
      this._id = document.count++;
      document.componentsMod[this._id] = this;
    }
    render() {
        switch(this.type){

            case 'radiogroup' :
                var html = `<p> ${this.title}</p>`
                this.options.forEach(opt => {
                    html += `<input onchange="document.componentsMod[${this._id}].setValue(this.value)" type="radio" name="${this.title}" id="${opt}" value="${opt}"/>
                    <label for="${opt}">${opt}</label>
                        `
                });
            return html;

            case 'dropdown':
                var html = `
                    <label for="${this.title}">${this.title}</label>
                    <select name="${this.title}" id="${this.title}" onchange="document.componentsMod[${this._id}].setValue(this.value)" >
                    <option value="">Please Select</option>
                `;

                this.options.forEach(opt => {
                    html += `<option value="${opt}">${opt}</option>`
                });
                html += `</select>`;
            return html;

            default:
            return '';
        }

    }

    // handle(){
    //     document.querySelector('input[type=radio][name="What is India\'s capital"]:checked')
    // }

    setValue( value ){
        this.value = value;
    }

}
