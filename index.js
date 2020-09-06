let app = new Vue({
  el: '#app',
  data() {

        return {
            urls:[],
            url:'',
            method:'get',
            tagsText:'',
            summary:'',
            parameters:[],
            requestBody:[],
            appUrl:'http://127.0.0.1:8000/'
        }
    },
    computed:{
        tags(){
            if (this.tagsText.trim().length === 0) {
                return null
            }
            return this.tagsText.split(',')
        },
        basicDataFilled(){
           return this.url.length !== 0 && this.tags && this.tags.length > 0
        }
    },

    watch:{
        url(n,o){
            if(n.length === 0){
                this.parameters =[]
                return
            }
            if(n.length > 0){
            var results = []
            let regexp = /\{(.*?)\}/g
            results = n.match(regexp) == null ? [] : n.match(regexp)
            if(results.length > 0) {

                this.parameters = results.join(' ').replace(/[\{\}]/g,'').split(' ')
                this.parameters = this.parameters.filter( function (val){
                    return val.length > 0
                })


                this.parameters.forEach((val,index) => {
                        this.parameters[index] = {name:val, schema: {type:'integer'}, description:`${val} Description`, in:'path' , required:true}
                })

            }
        }
        },

    },
mounted() {
this.getPaths()
},
methods:{
    getPaths(){
        const self = this
        axios({
            method: 'get',
            url: `${self.appUrl}api/swagger-generator/`,
          }).then(function (response) {
              console.log(response.data)
            self.urls = response.data.urls
        })
    },

    addRequest(){
        this.requestBody.push({
            name:'name', type:'integer', example:'example'
        })
    },

    removeRequest(index){
        this.requestBody.splice(index,1)
    },
    resetSettings(){
        this.urls=[]
        this.url=''
        this.method='get'
        this.tagsText=''
        this.summary=''
        this.parameters=[]
        this.requestBody=[]
    },
    createUrl(e){
        e.preventDefault()
        const self = this
        let index = this.urls.indexOf(this.url)

        if (!this.basicDataFilled) {
            alert('Please fill the basic data url ,method and tags')
            return
        }

        if (this.requestBody.length > 0) {
            var allRequestBodyFilled = this.requestBody.filter(val=> val.name.trim().length === 0 || val.example.trim().length === 0).length

            if (allRequestBodyFilled > 0 ) {
                alert ('some request body fields are empty')
                return
            }
        }

        if (index != -1) {
            const sure = confirm('This url already exists do you want to overwrite current settings')
            if (!sure) {
                return
            }
        }

        axios({
            method:'post',
            url: `${self.appUrl}api/swagger-generator/`,
            data:{
                url:self.url,
                method:self.method,
                tags:self.tags,
                parameters:self.parameters,
                requestBody: self.requestBody.length > 0 ? self.requestBody : null,
                summary:self.summary
            }
        }).then(function(response){
            alert('URL add successfully');
            self.getPaths()
            self.resetSettings();
        }).catch(function(error){
            alert('error in adding url')
        })


    }

    }
})
