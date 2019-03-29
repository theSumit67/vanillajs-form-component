let data = [
	{
        id:'Q-101',
        title:'What is India\'s capital',
        type:'radiogroup',
        options:['Delhi','Mumbai','Kolkatta','Pune']
    },{
        id:'Q-102',
        title:"Grand Central Terminal, Park Avenue, New York is the world's",
        type:'radiogroup',
        options:['largest railway station','highest railway station','longest railway station','None of the above']
    },{
        id:'Q-103',
        title:'Entomology is the science that studies',
        type:'dropdown', 
        options:['Behavior of human beings','Insects','The origin and history of technical and scientific terms','The formation of rocks']
    }
];




document.componentsMod = {};
document.count = 0;
document.currentPage = 0;


class FormControl {
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

    setValue( value ){
        this.value = value;
        document.componentsMod.wizard.valueUpdated( this._id );
    }

}



class FormWizard {

    constructor(data){
        this.data = data;
        this._len = data.length;

        this.currentPage = 0;
        this.answers = new Array(data.length).fill(null);

        this.child_components = [];
        this.data.forEach(element => {
            this.child_components.push(new FormControl( element ));
        });
        this.child_components_len = this.child_components.length;
        document.componentsMod["wizard"] = this;
    }
    render() {
        let steps = '';
        this.child_components.forEach(( child, i ) => {
            steps += `
                <div class="steps ${(i === 0 ? 'show' : '')}">
                    ${child.render()}
                </div>
            `;
        });

        let html = `
            <div>
                ${steps}
            </div>
            <ol>
                ${'<li>'.repeat(this.length)}
            </ol>
            <button class="prevBtn" disabled="true" onclick="document.componentsMod.wizard.prev()" >Prev</button>
            <button class="nextBtn" disabled="true" onclick="document.componentsMod.wizard.next()" >Next</button>
            <button class="submitBtn" disabled="true" onclick="document.componentsMod.wizard.submit()" >Submit</button>
        `;

        return html;
    }

    prev(){
        if( this.currentPage >= 0){
            this.currentPage--;
            var steps = document.getElementsByClassName("steps");
            // var dots = document.getElementsByClassName("steps-dot");
            var prevBtn = document.querySelector(".prevBtn");
            var nextBtn = document.querySelector(".nextBtn");

            if( this.currentPage == 0 ){
                prevBtn.disabled = true;
            } else {
                prevBtn.disabled = false;
            }
            nextBtn.disabled = false;
            document.querySelector(".steps.show").classList.remove("show");

            steps[this.currentPage].classList.add("show");
        }

    }
    next(){
        if( document.componentsMod[this.currentPage].value && this.currentPage < this.child_components_len-1 ){
            this.currentPage++;
            var steps = document.getElementsByClassName("steps");
            // var dots = document.querySelector(".steps-dot");
            var prevBtn = document.querySelector(".prevBtn");
            var nextBtn = document.querySelector(".nextBtn");

            if ( document.componentsMod[this.currentPage].value ){

                if( this.currentPage == this.child_components_len -1 ){
                    nextBtn.disabled = true;
                    // submit check all values
                } else {
                   nextBtn.disabled = false;
                }
            } else {
                nextBtn.disabled = true;
            }

            prevBtn.disabled = false;

            document.querySelector(".steps.show").classList.remove("show");
            steps[this.currentPage].classList.add("show");

        }
        
    }
    submit(){
        console.log( "Selected Answerd - " , this.answers );
    }

    valueUpdated( comp_id ){
        this.answers[comp_id] = document.componentsMod[comp_id].value;
        var prevBtn = document.querySelector(".prevBtn");
        var nextBtn = document.querySelector(".nextBtn");
        console.log( "YES IT IS ", this.currentPage == comp_id );
        // value set on current question
        if( comp_id == 0 ){
            nextBtn.disabled = false;
        } 
        if( comp_id == this.child_components_len -1 ){
            nextBtn.disabled = true;
            prevBtn.disabled = false;
            document.querySelector(".submitBtn").disabled = false;
        } else {
            nextBtn.disabled = false;
        }
    }

}

var wiz = new FormWizard( data );

document.getElementById('main' ).innerHTML = wiz.render();
