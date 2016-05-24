package messages

type WSComputeMessage struct {
	Action string               `json:"action"`
	Data   WSComputeMessageData `json:"data"`
}

type WSComputeMessageData struct {
	AuthToken    string            `json:"authToken"`
	ComputeSteps []string          `json:"computeSteps"`
	HashID       string            `json:"hashId"`
	PublicScope  map[string]string `json:"publicScope"`
	Results      []string          `json:"results"`
}
