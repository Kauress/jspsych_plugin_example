var jsPsychPsyanimRuntime = (function (jspsych) {
  'use strict';

  const info =  {
      name: 'psyanim-runtime-plugin',
      parameters: {
        psynFileUrl: {
          type: jspsych.ParameterType.STRING,
          default: './data.psyn'
        },

        html: {
          type: jspsych.ParameterType.HTML_STRING,
          default: ''
        },

        animationHolderId: {
          type: jspsych.ParameterType.STRING,
          default: ''
        },

        trialDuration: {
          type: jspsych.ParameterType.INT,
          default: -1
        }
      }
  };

  /**
   * psyanim-runtime-plugin
   * jsPsych plugin for displaying .psyn simulations
   * 
   * Make sure to use the latest version of psyanim-runtime
  */
  class PsyanimRuntimePlugin {
    constructor(jsPsych) {
        this.jsPsych = jsPsych;
    }
    
    trial(display_element, trial){
      display_element.innerHTML = trial.html;

      this.runtime = new PsyanimRuntime.Runtime();
      this.runtime.init(trial.psynFileUrl, trial.animationHolderId? trial.animationHolderId : display_element, (world)=>{
        // world has successfully been created

        this.runtime.play();
        // end if the animation is done playing 
        this.runtime.events.on('done-playing', ()=> {this.endTrial(display_element);});

        console.log(this.runtime.world.grandTimeline.totalDuration());

        // end trial if trial_duration is set
        if (trial.trialDuration !== -1) {
          this.jsPsych.pluginAPI.setTimeout(()=> {this.endTrial(display_element);}, trial.trialDuration);
        }

      });
    }

    getStateLog(){
      return this.runtime.world.stateLogger.state;
    }

    endTrial(display_element){
      // kill any remaining setTimeout handlers
      this.jsPsych.pluginAPI.clearAllTimeouts();
      
      // gather the data to store for the trial
      var trial_data = {
        state: this.getStateLog()
      };

      console.log("trial ended: ", trial_data);

      // clear the display
      display_element.innerHTML = "";

      // move on to the next trial
      this.jsPsych.finishTrial(trial_data);
    }
        
  }
  PsyanimRuntimePlugin.info = info;

  return PsyanimRuntimePlugin;

})(jsPsychModule);
