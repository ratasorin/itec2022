interface Specification {
  render: boolean;
  box?: {
    width: number;
    height: number;
    left: number;
    top: number;
  };
}

type ActionSpecification = Omit<Specification, 'render'>;

export interface Blueprint<T> {
  Component: {
    specification: Specification;
    payload: T;
  };

  Action: {
    specification: ActionSpecification;
    payload: T;
  };
}
