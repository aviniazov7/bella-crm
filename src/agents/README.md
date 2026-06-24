# agents/

Reserved for automation logic (e.g. reminder dispatch, birthday greetings,
scheduled report generation). Each agent should be a pure module that depends
only on the `services/` layer so it can be unit-tested and, later, run from a
Cloud Function or a cron job.
