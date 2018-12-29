<template>
  <vue-chart
        :chart-type="chartType"
        :columns="columns"
        :rows="rows"
        :options="options"
  ></vue-chart>
</template>
<script>

export default {
  data () {
    return {
      chartType: 'LineChart',
      loading: false,
      post: null,
      columns: [{
        'type': 'string',
        'label': 'Year'
        },
        {
          'type': 'number',
          'label': 'Impressions'
        },
        {
          'type': 'number',
          'label': 'Clicks'
        },
        ],
      rows: null,
      options: {
        title: 'Company Performance',
        hAxis: {
          title: 'Year',
          minValue: '2005',
          maxValue: '2007'
        },
        vAxis: {
          title: '',
          minValue: 0,
          maxValue: 20
        },
        width: 900,
        height: 500,
      },
      error: null
    }
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true
      var totalImpression = 0;
      var auth = "Basic interview_1 : int_candidate12"

      
      fetch('http://35.243.142.103:5000/get_data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('interview_1:int_candidate12') 
        }
      }).then(response => response.json())
      .then( responseJson => {
        this.parseData(responseJson);
      }).catch(err => {
        console.log("error")
      });
    },
    parseData(response) {
      var impressionMap = new Map();
      var clicksMap = new Map();
      var allDates = [];
      var impressionsSorted = [];
      var clicksSorted = [];
      var sortedDates = [];
      var finalClickImpression = [];
      Object.keys(response).map( key => {

        var date = new Date(response[key].date);
        var currentDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        allDates.push(date);
        var currentImpCount = impressionMap.get(currentDate) || 0;
        var impressionCount = currentImpCount + response[key].impressions;
        impressionMap.set(currentDate, impressionCount);
        
        var currentClckCount = clicksMap.get(currentDate) || 0;
        var clicksCount = currentClckCount + response[key].clicks;
        clicksMap.set(currentDate, clicksCount);

      });

      allDates.sort(function(a, b) {
        return a - b;
      });
      
      allDates.map( date => {
        sortedDates.push(date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear());
      });

      const sortedDatesNoDup = [...new Set(sortedDates)];

      sortedDatesNoDup.map( date => {
        var currentValues = [];
        currentValues.push(date);
        currentValues.push(impressionMap.get(date));
        currentValues.push(clicksMap.get(date));
        finalClickImpression.push(currentValues)
      });

      this.rows = finalClickImpression;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
