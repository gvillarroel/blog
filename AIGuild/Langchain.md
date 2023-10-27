LangChain (66K ⭐) is a framework designed for developing applications powered by large language models (LLMs). It simplifies the creation of applications by providing a modular and extensible structure, which allows developers to build context-aware, reasoning applications.  facilitates the integration of language models with various data sources and services, and supports a range of functionalities including document analysis, chatbots, code analysis, and more, making it a robust tool for leveraging the capabilities of language models in application development.

https://www.youtube.com/watch?v=2xxziIWmaSA

https://www.youtube.com/watch?v=aywZrzNaKjs

### Components

![[Langchain features.png]]

- [**Models**](https://python.langchain.com/en/latest/modules/models.html) This module likely handles the integration and management of various large language models (LLMs). It may include functionalities for loading models, setting up configurations, and interfacing with these models to perform language processing tasks.. This would include local models or external API's such as OpenAI GPT or Google AI Using Vertex.
- [**Schema**](https://docs.langchain.com/docs/components/schema/) Define a common way to deal with data structures that other components requires, for instance Text, Documents, Chat History and Examples for LLMs.
- [**Prompts**](https://python.langchain.com/en/latest/modules/prompts.html) - Prompts module could be about managing and generating prompts that are fed into the LLMs. This module might contain functionalities to create, store, and manipulate prompts to ensure they elicit the desired responses from the models. 
- [**Memory**](https://python.langchain.com/en/latest/modules/memory.html) This module may be responsible for managing the state and memory of the application, particularly when dealing with the memory capabilities of LLMs. It might include functionalities for storing and retrieving information, handling long-term and short-term memory, and managing stateful interactions within the application..
- [**Indexes**](https://python.langchain.com/en/latest/modules/indexes.html) The Indexes module likely deals with indexing and searching capabilities within the application. It might include functionalities for creating indexes, performing search queries, and managing the retrieval of information from various data sources.
- [**Chains**](https://python.langchain.com/en/latest/modules/chains.html) Chains module could be about orchestrating a sequence of operations or tasks in a workflow. It may provide functionalities for defining, managing, and executing task chains, which could be crucial for complex applications that require orchestrated processing.
- [**Agents**](https://python.langchain.com/en/latest/modules/agents.html) This module might handle the definition, management, and operation of agents within the LangChain environment. It could include functionalities for creating agents, defining their behaviors, and managing their interactions with other agents, users, and data sources.
These modules, as part of LangChain, likely work together to provide a robust framework for developing sophisticated LLM-powered applications, by offering a structured and modular approach to handle various aspects of application development and runtime management.
### Alternatives
Here's a summary of alternatives to LangChain along with some points on why these alternatives might be a good idea give a try:
- **[AutoGen (Microsoft)](https://github.com/microsoft/autogen)** (14K ⭐):
	- Enables development of LLM applications via **multi-agent** conversations.
	- Good for applications requiring complex agent-human interactions and dynamic workflows​​.
- **[AutoGPT](https://github.com/Significant-Gravitas/AutoGPT)** (152K ⭐:):
	- Focuses on transforming GPT-4 into a fully autonomous chatbot, providing a specific solution for autonomous AI agents.
	- Unlike LangChain, it's designed to execute codes and commands to deliver specific goal-oriented solutions​.
- **[LlamaIndex](https://github.com/run-llama/llama_index)** (23K ⭐):
	- A smart storage mechanism for querying data for downstream LLM use cases.
	- Ideal for projects requiring a solid data querying mechanism alongside LLM applications​​.

### Complements
Here some application than use or extends Langchain.
* **[FlowiseAI](https://github.com/FlowiseAI/Flowise)** (17K ⭐):
	* Drag-and-drop UI for constructing LLM flows and LangChain apps, making it user-friendly for developers who prefer a graphical interface.
	* Great for organizations lacking the means to employ a developer as it simplifies LLM app development​.
- **[AnythingLLM](https://github.com/Mintplex-Labs/anything-llm)** (2K ⭐):
	- A generalized framework for developing applications using Large Language Models (LLMs).
	- Ideal for those seeking a more adaptable and undefined approach to LLM application development, allowing for a wide range of customization and flexibility in integrating various data sources, tools, and LLM functionalities.

### How to use @ Equifax
To use Langchain you will require a LLM, at Equifax you can use it locally using huggingface or Vertex AI. If you want to use Vertex you require also predict access on the  project. Role: `Role` .

#### Run it locally

https://github.com/GoogleCloudPlatform/generative-ai/blob/main/language/orchestration/langchain/intro_langchain_palm_api.ipynb

#### Run it from Vertex AI Workbench


### References
1. [Building Generative AI applications made easy with Vertex AI PaLM API and LangChain](https://cloud.google.com/blog/products/ai-machine-learning/generative-ai-applications-with-vertex-ai-palm-2-models-and-langchain)
2. [The LangChain Cookbook - Beginner Guide To 7 Essential Concepts](https://www.youtube.com/watch?v=2xxziIWmaSA)